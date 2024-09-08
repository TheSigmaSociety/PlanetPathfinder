from flask import Flask, jsonify
from flask_cors import CORS
import datetime as dt
import locations as l
app = Flask(__name__)
@app.route("/getSigmaCoords",methods=['GET'])
def getPlanets():
    pos = l.getPositions(dt.datetime.now())
    scalar = 1
    for keys,values in pos.items():
        hypot = np.sqrt(np.square(values[0]) + np.square(values[1]))
        pos[keys] = [scalar*values[0]/hypot,scalar*values[1]/hypot]
        scalar+=1
    return jsonify(pos), 200

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)