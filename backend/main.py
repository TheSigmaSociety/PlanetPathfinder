from flask import Flask, jsonify
from flask_cors import CORS
import datetime as dt
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

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)