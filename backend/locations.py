from planet import Planet
import json
import planet
from skyfield.api import load
import numpy as np
from datetime import timedelta
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

def calculateEuclidean(planet1, planet2):
    return np.linalg.norm(planet1.position - planet2.position)
    
def findOptimalAlignment(startDate, endDate, currentPlanet, targetPlanet):
    ts = load.timescale()
    planets = load('de421.bsp')
    current = planets[currentPlanet]
    target = planets[targetPlanet]
    
    min_distance = float('inf')
    optimal_date = None
    
    currentDate = startDate
    while currentDate <= endDate:
        t = ts.utc(currentDate.year, currentDate.month, currentDate.day)
        currentPos= current.at(t).position.au
        targetPos = target.at(t).position.au
        distance = calculateEuclidean(currentPos, targetPos)
        
        if distance < min_distance:
            min_distance = distance
            optimal_date = current_date
        
        current_date += timedelta(days=30)
    
    return optimal_date, min_distance

def findOptimalPath(startDate, targetPlanets):
    path = []
    current_date = startDate
    current_planet = 'earth'
    
    for target in targetPlanets:
        optimal_date, min_distance = findOptimalAlignment(current_date, current_date + timedelta(days=365), current_planet, target)
        path.append((target, optimal_date, min_distance))
        current_date = optimal_date
        current_planet = target
    
    return path