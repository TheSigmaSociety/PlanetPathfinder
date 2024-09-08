from planet import Planet
import json
from skyfield.api import load
import numpy as np
from datetime import datetime

def getPositions(time):
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
    return positions

timestamp = datetime(2024, 9, 7, 0, 0, 0)
positions = getPositions(timestamp)

for planet, pos in positions.items():
    print(f"{planet.capitalize()}: ({pos[0]:.6f}, {pos[1]:.6f}, {pos[2]:.6f})")