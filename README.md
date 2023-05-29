Build and Run:
```
cd client
npm install
npm run serve

cd server
npm install
npm run prod
```

# 2020 SU UAV Animation(Vue)
Update Aug 8

Finally stable version

- Timestp in both UAV data and MAV data should keep same
- before clicking fly btn, waitting for about 10 seconds for initializing data to prevent from missing some time steps.
- Max time steps currently is 500
- Float precision should not more than .7f

---

Update Jun 17 

- Average number of Manned Aircraft in the area
  - [ ] Flightradar24
  - [ ] Flightaware
- show conflicts in dashboard
- Cesium????

---
Update TODO: 6.15.2020

- [x] Erase the icon left by MAV that has changed level

---

Update TODO: 6.10.2020

- Get different Level MAV Data and load in "Orange"
  - [x] <font color=#0e96f1>Get MAV Data( before 6.12.2020)</font>
  - [x] <font color=#0cb908>update MAV Class</font>
- [x] <font color=#0cb908>Animation Speed function under reactive Mode</font>

- [x] <font color=#0cb908>Fix back track function for MAV module</font>




