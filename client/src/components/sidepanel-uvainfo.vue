<template>
    <div class="infoArea">
        <div class="separate-line"></div>
        <p>
            <label class="label">Current time:</label>
            <input type="text" class="txtbox " id="curtime" value="0">
        </p>
        <div class="separate-line"></div>
        <p>
            <label class="label">Current UAV num:</label>
            <input type="text" class="txtbox " id="curUAVnum" value="0">
        </p>
        <div class="separate-line"></div>
        <p>
            <label for='setCurtime' class="label">Set current time:</label>
            <input type="text" class="txtbox" id="setCurtime" v-on:change="getCurrTime()">
        </p>
        <div class="separate-line"></div>
        <p>
            <label for='timeinterval' class="label">Animation speed interval:</label>
<!--            <input type="text" class="txtbox" id="timeinterval"  v-on:change="setTimeInterval()" v-model="timeInterval" placeholder="0">-->
            <ticks></ticks>
        </p>
        
        <div class="separate-line"></div>
        <div class="auvOption">
        <table>
            <tr>
                <td>
                    <label>Show UAV track</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="uavTrackChkBox" type="checkbox"  v-on:change="setShowTrack()" checked>
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label>Show UAV ID</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="uavIDChkBox" type="checkbox" v-on:change="setShowUAVID()">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label>Hide UAV icon and track after landing</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="uavHideChkBox" type="checkbox" v-on:change="setHideUAVTrack()" checked>
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td>
                    <label class="level1">Level 1</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="l1ChkBox" type="radio" v-model="level" value="1"  v-on:change="setLevel1()">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label class="level2">Level 2</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="l2ChkBox" type="radio" v-model="level" value="2"  v-on:change="setLevel2()">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label class="level3">Level 3</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="l3ChkBox" type="radio" v-model="level" value="3"  v-on:change="setLevel3()">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label class="level4">Level 4</label>
                </td>
                <td>
                    <label class="switch">
                        <input id="l4ChkBox" type="radio" v-model="level" value="4"  v-on:change="setLevel4()">
                        <span class="slider"></span>
                    </label>
                </td>
            </tr>
        </table>
    </div>
    </div>
</template>


<script>
import ticks from './ticks'

export default {
    name: 'sidepanel-uvainfo',
    components: {
        ticks,
    },
    data() {
        return {
            timeInterval: '',
            level: ''
        }
    },

    methods: {
        getCurrTime() {
            // Event.fire('getCurrTime', time);
            let time = document.getElementById('setCurtime').value;
            Event.fire('getCurrTime', time);
        },
        setTimeInterval() {
            console.log(this.timeInterval);
            Event.fire('setTimeInterval', this.timeInterval)
        },
        setShowTrack() {
            Event.fire('setShowTrack');
        },
        setShowUAVID() {
            Event.fire('setShowUAVID');
        },
        setHideUAVTrack() {
            Event.fire('setHideUAVTrack');
        },
        setLevel1() {
            console.log(this.level);
            Event.fire("level1", this.level);
        },
        setLevel2() {
            console.log(this.level);
            Event.fire("level2", this.level);
        },
        setLevel3() {
            console.log(this.level);
            Event.fire("level3", this.level);
        },
        setLevel4() {
            console.log(this.level);
            Event.fire("level4", this.level);
        },
    },
}


</script>

<style lang="less">
    .infoArea {
        display: block;
    }
    .label {
        text-transform: uppercase;
        display:inline-block;
        width: 80%;
        text-align: center;
        text-decoration:none;
        font-size: 13px;
    }
    .txtbox {
        background-color: #FFFFFF;
        border-color: black;
        border-style: solid;
        border-width: 2px ;
        border-radius: 4px;
        color: black;
        padding: 14px 24px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        font-size: 16px;
        height: 100%;
    }
    .separate-line {
        height: 0;
        border-top: 1px solid #f0f0f0;
        flex: none;
        white-space: normal;
    }
    .auvOption {
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .level1 {
        background-color: #95ff6d;
        color: white;
    }
    .level2 {
        background-color: #32b300;
        color: white;
    }
    .level3 {
        background-color: #00aeff;
        color: white;
    }
    .level4 {
        background-color: #1500ff;
        color: white;
    }
</style>



