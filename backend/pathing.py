from planet import Planet
import json
from planet import Planet
from skyfield.api import load
import numpy as np
from datetime import timedelta
from datetime import datetime
planetObjects = []
def getPositions(timestamp):
    planets = load('de421.bsp')
    ts = load.timescale()
    t = ts.utc(timestamp.year, timestamp.month, timestamp.day, 
               timestamp.hour, timestamp.minute, timestamp.second)
    planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter barycenter', 'saturn barycenter', 'uranus barycenter', 'neptune barycenter']
    positions = {}
    for name in planetNames:
        planet = planets[name]
        astrometric = planet.at(t)
        position = astrometric.position.au  
        positions[name] = position
        planetObjects.append(Planet(name, position, timestamp))
    return positions

def printPositions(positions):
    for planet, pos in positions.items():
        print(f"{planet.capitalize()}: ({pos[0]:.6f}, {pos[1]:.6f}, {pos[2]:.6f})")

def calculateEuclidean(pos1, pos2):
    return np.linalg.norm(pos1.position - pos2.position)
    
def findOptimalAlignment(startDate, endDate, currentPlanetIndex, targetPlanetIndex):
    ts = load.timescale()
    planets = load('de421.bsp')
    current = planetObjects[currentPlanetIndex]
    target = planetObjects[targetPlanetIndex]
    
    minDistance = float('inf')
    optimalDate = None
    minCurrentPos = None
    minTargetPos = None
    currentDate = startDate
    while currentDate <= endDate:
        t = ts.utc(currentDate.year, currentDate.month, currentDate.day)
        current.position = planets[current.name].at(t).position.au
        target.position = planets[target.name].at(t).position.au
        distance = calculateEuclidean(current, target)
        
        if distance < minDistance:
            minDistance = distance
            optimalDate = currentDate
            minCurrentPos = current.position
            minTargetPos = target.position
        
        currentDate += timedelta(days=10)
    
    return optimalDate, minDistance, minCurrentPos, minTargetPos

def findOptimalPath(startDate, targetPlanets):
    path = []
    currentDate = startDate
    currentPlanet = 2
    
    for i, target in enumerate(targetPlanets):
        optimalDate, minDistance, mincurPos,minTarPos = findOptimalAlignment(currentDate, currentDate + timedelta(days=700), currentPlanet, i)
        path.append((currentPlanet, target, optimalDate, minDistance,mincurPos,minTarPos))
        currentDate = optimalDate
        currentPlanet = target
    return path

# testing her har
if __name__ == '__main__':
    timestamp = datetime.now()
    positions = getPositions(timestamp)
    printPositions(positions)
    print(calculateEuclidean(planetObjects[0], planetObjects[1]))
    print(findOptimalAlignment(timestamp, timestamp + timedelta(days=365), 2, 3))
    print(findOptimalPath(timestamp, [3, 4, 5]))