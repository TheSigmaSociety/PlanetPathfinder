from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime as dt
import pathing as l
import numpy as np

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for the app
CORS(app)

# Route to get the current positions of planets
@app.route("/getSigmaCoords", methods=['GET'])
def getPlanets():
    # Return the positions of planets as JSON with a 200 status code
    return jsonify(helper(dt.datetime.now())), 200

# Helper function to calculate normalized positions of planets
@app.route("/getAnySigmaCords", methods=['GET'])
def helper(datetimeobj):
    # Get positions of planets from the pathing module
    pos = l.getPositions(datetimeobj)
    scalar = 1
    # Normalize the positions
    for keys, values in pos.items():
        hypot = np.sqrt(np.square(values[0]) + np.square(values[1]) + np.square(values[2]))
        pos[keys] = [scalar * values[0] / hypot, scalar * values[1] / hypot]
        scalar += 1
    return pos

# Route to get positions of planets for a specific datetime
@app.route("/getAnySigmaCords", methods=['GET'])
def helphelp():
    # Extract datetime parameters from the request
    year, month, day, hour, min, sec = request.args.get("y"), request.args.get("m"), request.args.get("d"), request.args.get("h"), request.args.get("m"), request.args.get("s")
    # Return the positions of planets for the specified datetime as JSON
    return jsonify(helper(dt.datetime(year, month, day, hour, min, sec)))

# Run the Flask app
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)