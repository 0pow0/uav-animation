import pandas as pd

data = pd.read_csv("/Users/zuorui/Desktop/uav_coordinate_reactive.csv")

print(data.shape)
del data["Level"]

del data["Manned"]

print(data.shape)

data.to_csv("/Users/zuorui/Desktop/uav_coordinate_reactive_test.csv", index=False)