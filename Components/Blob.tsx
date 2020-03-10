import React from "react"
import { Animated, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useEffect, useMemo, useRef, useState } from "react";


class Blob extends React.Component<{ radius: number, finalRadius: number }, {
    pointBasis: Array<{ random: number, angle: number }>,
    path?: string,
    width: number,
    height: number
}> {
    _path = undefined
 

    constructor(props) {
        super(props);
      
        const pointCount = 10
        const width = props.width
        const height = props.height

        const pointBasis = new Array(pointCount).fill(0).map((_, i) => {
            const angle = (2 * Math.PI) * i / pointCount
            const random = Math.random()
            return { random, angle }
        })

        this.state = {
            width,
            height,
            pointBasis
        };

    }

 
    componentDidUpdate(prevProps) {
        if (prevProps.radius === this.props.radius) return
        const { radius, finalRadius } = this.props

        const { pointBasis, width, height } = this.state

        const distort = 1 - radius / finalRadius

        const points = pointBasis.map(({ random, angle }) => {
            const temperedOfRandomness = distort * random
            const lineRadius = radius + temperedOfRandomness * radius *0.7
            const x = lineRadius * Math.cos(angle) + width / 2
            const y = lineRadius * Math.sin(angle) + height / 2
            return { x, y }
        })


        const tolerance = 4;
        const highestQuality = false;

        let splinePath = cardinal(points, true, 1)

        this.setState({ path: splinePath })

        if (this._path) {
            this._path.setNativeProps({ d: splinePath });
        }

    }



















    render() {
        const { width, height, path } = this.state
        return path ? (<Path stroke="none" fill="rgb(255,165,0, 0.5)" ref={component => this._path = component} />) : null

    }


}




export default Animated.createAnimatedComponent(Blob)



// Cardinal spline - a uniform Catmull-Rom spline with a tension option
function cardinal(data, closed, tension) {

    if (data.length < 1) return "M0 0";
    if (tension == null) tension = 1;

    var size = data.length - (closed ? 0 : 1);
    var path = "M" + data[0].x + " " + data[0].y + " C";

    for (var i = 0; i < size; i++) {

        var p0, p1, p2, p3;

        if (closed) {
            p0 = data[(i - 1 + size) % size];
            p1 = data[i];
            p2 = data[(i + 1) % size];
            p3 = data[(i + 2) % size];

        } else {
            p0 = i == 0 ? data[0] : data[i - 1];
            p1 = data[i];
            p2 = data[i + 1];
            p3 = i == size - 1 ? p2 : data[i + 2];
        }

        var x1 = p1.x + (p2.x - p0.x) / 6 * tension;
        var y1 = p1.y + (p2.y - p0.y) / 6 * tension;

        var x2 = p2.x - (p3.x - p1.x) / 6 * tension;
        var y2 = p2.y - (p3.y - p1.y) / 6 * tension;

        path += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
    }

    return closed ? path + "z" : path;
}
