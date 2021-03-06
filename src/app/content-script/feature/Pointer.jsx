import React, { Component } from "react";
import PropTypes from "prop-types";
import Panel from "./Panel.jsx";
import { convertRgbToHex } from "../../utils";
import { slideFetch, destory } from "../../service";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isMove: false,
			isClick: false,
			top: null,
			left: null,
			centerColor: "rgb(255,255,255)",
			centerColorHex: "#FFFFFF",
			colorGroups: [],
		};
	}

	mousemoveHandler = (e) => {
		const OFFSET = 85;
		// 此时为pointer的client 非鼠标client
		this.setState({
			top: e.clientY - OFFSET,
			left: e.clientX - OFFSET,
		});

		if (!this.state.isMove) {
			this.setState({
				isMove: true,
				isActive: false,
			});
		}

		const centerX = this.state.left;
		const centerY = this.state.top;

		slideFetch({ centerX, centerY }).then((colorGroups) => {
			const midIdx = Math.floor(colorGroups.length / 2);

			this.setState({
				colorGroups,
				centerColor: colorGroups[midIdx],
				centerColorHex: convertRgbToHex(colorGroups[midIdx]),
			});
		});
	};

	clickHandler = () => {
		// 先复制再关闭
		const color = this.state.centerColor;
		const tempInput = document.createElement("input");
		document.body.appendChild(tempInput);
		tempInput.value = this.state.centerColorHex;
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);

		this.setState({
			isClick: true,
		});

		setTimeout(() => {
			destory({ color });
		}, 300);
	};

	render() {
		const { isStart } = this.props;
		const {
			top,
			left,
			colorGroups,
			centerColor,
			centerColorHex,
			isMove,
			isClick,
		} = this.state;
		const pointerClass = `pointer-wrapper ${isClick && "clickAnimate"}`;

		return (
			<div id="ColorPickerPointer" onMouseMove={(e) => this.mousemoveHandler(e)}>
				{((isStart && isMove)) && (
					<div
						className={pointerClass}
						style={{ top: `${top}px`, left: `${left}px`, backgroundColor: centerColor }}
					>
						<div className="pointer" onClick={(e) => this.clickHandler(e)}>
							{colorGroups.map((item, i) => (
								<div
									className="pointer-grid-item"
									key={i}
									style={{ backgroundColor: item || "rgb(255,255,255)" }}
								></div>
							))}

							<div className="centerBlock"></div>
							<div className="floatTip">{centerColorHex}</div>
						</div>
					</div>
				)}
				{isStart && <Panel currentColor={centerColor} currentColorHex={centerColorHex} />}
			</div>
		);
	}
}

App.propTypes = {
	isStart: PropTypes.bool,
};
