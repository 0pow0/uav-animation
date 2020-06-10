import pandas as pd

data = pd.read_csv("/Users/zuorui/WebstormProjects/thalesVisulization/uav_animation/server/localdata/uav_coordinate_reactive_level_4.csv")

print(data.shape)
data["TimeStep"] = data["TimeStep"].astype(int)
data["ID"] = data["ID"].astype(int)
data["SignalStrength"] = data["SignalStrength"].astype(int)
data["CurrentBasestation"] = data["CurrentBasestation"].astype(int)
data["finished"] = data["finished"].astype(int)
data["Trajectory"] = data["Trajectory"].astype(int)
data["Level"] = data["Level"].astype(int)
# init = data["Longitude"][0]
# print(init)
# print(data["Longitude"])
# data["Longitude"] = [init-0.005*i for i in range(data.shape[0])]
# print(data["Longitude"])
# print(data)
data.to_csv("/Users/zuorui/WebstormProjects/thalesVisulization/uav_animation/server/localdata/uav_coordinate_reactive_level_4.csv",index=False)
# print(data.shape)

