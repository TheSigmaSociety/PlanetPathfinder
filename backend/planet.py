import numpy as np
class Planet:
    def __init__(self, name, position, velocity):
        self.name = name
        self.position = np.array(position)
        self.velocity = np.array(velocity)
    
    def __str__(self):
        return f"Planet(name={self.name}, position={self.position}, velocity={self.velocity})"

    def printFields(self):
        for key, value in self.__dict__.items():
            print(f"{key}: {value}")