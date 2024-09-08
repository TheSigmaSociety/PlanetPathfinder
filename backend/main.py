from flask import Flask
from flask_cors import CORS
import datetime

app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)