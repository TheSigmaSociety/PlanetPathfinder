import numpy as np
class Planet:
    def __init__(self, name, position, time):
        self.name = name
        self.position = np.array(position)
        self.time = time
    
    def __str__(self):
        return f"Planet(name={self.name}, position={self.position}, time={self.time})"

    def printFields(self):
        for key, value in self.__dict__.items():
            print(f"{key}: {value}")