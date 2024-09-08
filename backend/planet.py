import numpy as np

# Define the Planet class
class Planet:
    def __init__(self, name, position, time):
        # Initialize the Planet object with name, position, and time
        self.name = name
        self.position = np.array(position)  # Convert position to a NumPy array
        self.time = time
    
    def __str__(self):
        # Return a string representation of the Planet object
        return f"Planet(name={self.name}, position={self.position}, time={self.time})"

    def printFields(self):
        # Print all fields of the Planet object
        for key, value in self.__dict__.items():
            print(f"{key}: {value}")