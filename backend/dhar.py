import requests
print(requests.post("http://127.0.0.1:5000/getPath",json={"initalPlanet": "earth", "planets": ['venus', 'mars']},
    headers={"Content-Type": "application/json"}).content)