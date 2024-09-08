import requests
import numpy as np
from planet import Planet
import json

def getPlanetaryData():
    response = requests.get("https://api.le-systeme-solaire.net/rest/bodies/")
    data = response.json()
    return data

def keplerCalculation(M, e, tol=1e-6):
    E = M
    while True:
        delta = E - e * np.sin(E) - M
        if abs(delta) < tol:
            break
        E = E - delta / (1 - e * np.cos(E))
    return E

def positionCalculation(semiMajorAxis, eccentricity, mainAnomaly, inclination, longAscNode):
    M = np.radians(mainAnomaly)
    E = keplerCalculation(M, eccentricity)
    trueAnomaly = 2 * np.arctan2(np.sqrt(1 + eccentricity) * np.sin(E / 2),
                                 np.sqrt(1 - eccentricity) * np.cos(E / 2))
    distance = semiMajorAxis * (1 - eccentricity * np.cos(E))
    x = distance * np.cos(trueAnomaly)
    y = distance * np.sin(trueAnomaly)
    x_3d = x * np.cos(np.radians(longAscNode)) - y * np.sin(np.radians(longAscNode)) * np.cos(np.radians(inclination))
    y_3d = x * np.sin(np.radians(longAscNode)) + y * np.cos(np.radians(longAscNode)) * np.cos(np.radians(inclination))
    z_3d = y * np.sin(np.radians(inclination))
    
    return x_3d, y_3d, z_3d, trueAnomaly, E, distance

def velocityCalculation(semiMajorAxis, distance, trueAnomaly, eccentricity):
    mu = 1.32712440018e11
    speed = np.sqrt(mu * (2 / distance - 1 / semiMajorAxis))
    vx = -speed * np.sin(trueAnomaly)
    vy = speed * (eccentricity + np.cos(trueAnomaly))
    return vx, vy

def initSolarSystem(data):
    planets = []
    for body in data["bodies"]:
        if body["isPlanet"]: 
            semiMajorAxis = body["semimajorAxis"]
            eccentricity = body["eccentricity"]
            mainAnomaly = body["mainAnomaly"]
            inclination = body["inclination"]
            longAscNode = body["longAscNode"]
            
            x, y, z, trueAnomaly, eccentricAnomaly, distance = positionCalculation(semiMajorAxis, eccentricity, mainAnomaly, inclination, longAscNode)
            pos = [x, y, z]
            vx, vy = velocityCalculation(semiMajorAxis, distance, trueAnomaly, eccentricAnomaly)
            velo = [vx, vy]
        
            planet = Planet(body["englishName"], pos, velo)
            planets.append(planet)
            planet.printFields()
            
    return planets

d = getPlanetaryData()
with open("test.json", "w") as f:
    json.dump(d, f)
print(initSolarSystem(d))