from flask import Flask, jsonify,request
from flask_cors import CORS
import datetime as dt
from datetime import timedelta
import pathing as l
import numpy as np


app = Flask(__name__)
CORS(app)
@app.route("/getSigmaCoords",methods=['GET'])
def getPlanets():
    return jsonify(helper(dt.datetime.now())), 200

def helper(datetimeobj):
   
    pos = l.getPositions(datetimeobj)
    scalar = 1
    for keys,values in pos.items():
        hypot = np.sqrt(np.square(values[0]) + np.square(values[1]) + np.square(values[2]))
        pos[keys] = [scalar*values[0]/hypot,scalar*values[1]/hypot]
        scalar+=1
    return pos
@app.route("/getAnySigmaCords",methods=['GET'])
def helphelp():
    year,month,day,hour,min,sec = request.args.get("y"), request.args.get("m"), request.args.get("d"), request.args.get("h"), request.args.get("min"), request.args.get("s")
    return jsonify(helper(dt.datetime(year,month,day,hour,min,sec)))

@app.route("/getPath",methods=['POST'])
def path(): #['planets':['mars','mercury','venus']]
    x = request.get_json()
    planetToIndex = {"mercury":0,"venus":1,"earth":2,"mars":3,"jupiter":4,"saturn":5,"uranus":6,"neptune":7}
    indexToPlanet = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"]
    for i in range(len(x['planets'])):
        x['planets'][i] = planetToIndex[x['planets'][i]]
    align = l.findOptimalPath(dt.datetime.now(),x['planets'])
    for k in align:
        k[0] = indexToPlanet[k[0]]
        k[1] = indexToPlanet[k[1]]
        f'y: {k[2].year}, m:{k[2].month}, d:{k[2].day}, min: {k[2].minute}, sec: {k[2].second}'
        k.append(k[2].year)
        k.append(k[2].month)
        k.append(k[2].day)
        k.append(k[2].minute)
        k.append(k[2].second)
        k[2]  = f'y: {k[2].year}, m:{k[2].month}, d:{k[2].day}, min: {k[2].minute}, sec: {k[2].second}' #current date

    print(align)
    return jsonify(align)

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)