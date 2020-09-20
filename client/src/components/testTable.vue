<template>
    <div>
        <div class="table">
            <v-table
                    is-horizontal-resize
                    style="width:100%"
                    :columns="columns"
                    :table-data="tableData"
                    row-hover-color="#eee"
                    row-click-color="#edf7ff"
            ></v-table>
        </div>
    </div>
</template>

<script>

    const logURL = 'log/log/';
    import oboe from "oboe";

    export default {
        name: "testTable",
        data() {
            return {
                columns: [
                    {field: 'time', title: 'Time', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
                    {field: 'id', title: 'id', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
                    {field: 'latitude', title: 'latitude', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
                    {field: 'longitude', title: 'longitude', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
                    {field: 'conflict_ID', title: 'Conflict with', width: 280, titleAlign: 'center', columnAlign: 'left',isResize:true},
                    {field: 'conflict_type', title: 'Conflict Type', width: 280, titleAlign: 'center', columnAlign: 'left',isResize:true}
                ],
                logData: [],
                tableData: []
            }
        },
        async created() {
            await this.getLogData(logURL);
            console.log("logData length", this.logData.length);
            this.tableData = this.extractLog("0");
            Event.listen("currTime", (time) => this.reload_data(time))
        },

        methods: {
            reload_data(timeStep) {
                var temp = this.extractLog(timeStep);
                if (temp.length !== 0) this.tableData = temp;
            },

            sleep(ms) {
                 return new Promise(resolve => setTimeout(resolve, ms));
            },
            extractLog(timeStep){
                let res = [];
                let seg = 0;
                for (let i = 0; i < this.logData.length; i++) {
                    if (this.logData[i].Time_Step == timeStep) {
                        var temp = {};
                        temp["time"] = this.logData[i].Time_Step;
                        temp["id"] = this.logData[i].UAV_ID;
                        temp["latitude"] = this.logData[i].Latitude;
                        temp["longitude"] = this.logData[i].Longitude;
                        temp["conflict_ID"] = this.logData[i].Conflict_UAV;
                        temp["conflict_type"] = this.logData[i].Flag;
                        res.push(temp);
                    }
                }
                // console.log("seg ", seg, "res len : ", res.length, " mav data len: ", this.mavData.length);

                return res;
            },

            getLogData(logurl) {
                return new Promise(async (resolve, reject) => {
                    try {
                        var _this = this;
                        // console.log(_this);
                        console.log("get data from",logurl);
                        oboe(logurl).node(
                            '{Time_Step UAV_ID Latitude Longitude Conflict_UAV Flag}',
                            async function (jsonObject) {
                                _this.logData.push(jsonObject);
                            }
                        );

                        const flag = await _this.checkLogData();

                        if (flag) {
                            // console.log("_this uav data length",_this.uavData.length);
                            resolve(
                                _this.logData.map(post => ({
                                    ...post,
                                }))
                            );
                        }
                    } catch(err) {
                        reject(err);
                    }
                })
            },

            checkLogData() {
                return new Promise(async (resolve, reject) => {
                    try {
                        var _this = this;

                        let x = setInterval(() => {
                            if(_this.logData.length >= 100) {
                                clearInterval(x);
                                resolve(true);
                            }
                        }, 0);
                    } catch (err) {
                        reject(err);
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .table {
    }

</style>