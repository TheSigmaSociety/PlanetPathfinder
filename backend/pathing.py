from planet import Planet
import json
from skyfield.api import load
import numpy as np
from datetime import timedelta, datetime

# List to store Planet objects
planetObjects = []

# Function to get the positions of planets at a given timestamp
def getPositions(timestamp):
    # Load planetary data
    planets = load('de421.bsp')
    ts = load.timescale()
    # Create a timescale object for the given timestamp
    t = ts.utc(timestamp.year, timestamp.month, timestamp.day, 
               timestamp.hour, timestamp.minute, timestamp.second)
    # List of planet names to fetch positions for
    planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter barycenter', 'saturn barycenter', 'uranus barycenter', 'neptune barycenter']
    positions = {}
    # Iterate over each planet name
    for name in planetNames:
        planet = planets[name]
        # Get the astrometric position of the planet
        astrometric = planet.at(t)
        # Get the position in astronomical units (AU)
        position = astrometric.position.au  
        # Store the position in the dictionary
        positions[name] = position
        # Append a Planet object to the planetObjects list
        planetObjects.append(Planet(name, position, timestamp))
    return positions

# Function to print the positions of planets
def printPositions(positions):
    for planet, pos in positions.items():
        print(f"{planet.capitalize()}: ({pos[0]:.6f}, {pos[1]:.6f}, {pos[2]:.6f})")

# Function to calculate the Euclidean distance between two positions
def calculateEuclidean(pos1, pos2):
    return np.linalg.norm(pos1.position - pos2.position)
    
# Function to find the optimal alignment between two planets within a date range
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
    # Iterate over the date range in 10-day increments
    while currentDate <= endDate:
        t = ts.utc(currentDate.year, currentDate.month, currentDate.day)
        # Update the positions of the current and target planets
        current.position = planets[current.name].at(t).position.au
        target.position = planets[target.name].at(t).position.au
        # Calculate the distance between the current and target planets
        distance = calculateEuclidean(current, target)
        
        # Update the minimum distance and optimal date if a closer alignment is found
        if distance < minDistance:
            minDistance = distance
            optimalDate = currentDate
            minCurrentPos = current.position
            minTargetPos = target.position
        
        currentDate += timedelta(days=10)
    
    return optimalDate, minDistance, minCurrentPos, minTargetPos

# Function to find the optimal path to visit a sequence of target planets
def findOptimalPath(startDate, targetPlanets):
    path = []
    currentDate = startDate
    currentPlanet = 2  # Start from Earth (index 2)
    
    # Iterate over each target planet
    for i, target in enumerate(targetPlanets):
        # Find the optimal alignment for the current and target planets
        optimalDate, minDistance, mincurPos, minTarPos = findOptimalAlignment(currentDate, currentDate + timedelta(days=700), currentPlanet, i)
        # Append the optimal alignment details to the path
        path.append((currentPlanet, target, optimalDate, minDistance, mincurPos, minTarPos))
        currentDate = optimalDate
        currentPlanet = target
    return path

# Testing the functions
if __name__ == '__main__':
    timestamp = datetime.now()
    # Get and print the positions of planets
    positions = getPositions(timestamp)
    printPositions(positions)
    # Calculate and print the Euclidean distance between two planets
    print(calculateEuclidean(planetObjects[0], planetObjects[1]))
    # Find and print the optimal alignment between two planets
    print(findOptimalAlignment(timestamp, timestamp + timedelta(days=365), 2, 3))
    # Find and print the optimal path to visit a sequence of planets
    print(findOptimalPath(timestamp, [3, 4, 5]))