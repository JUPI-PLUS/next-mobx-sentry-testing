import React from "react";

var getDOMNode;
// Super naive semver detection but it's good enough. We support 0.12, 0.13
// which both have getDOMNode on the ref. 0.14 and 15 make the DOM node the ref.
var version = React.version.split(/[.-]/);
if (version[0] === "0" && (version[1] === "13" || version[1] === "12")) {
    getDOMNode = ref => ref.getDOMNode();
} else {
    getDOMNode = ref => ref;
}

class Barcode extends React.Component {
    constructor(props) {
        super(props);
        this.renderElementRef = React.createRef();
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const { value } = this.props;
        var renderElement = getDOMNode(this.renderElementRef.current);
        try {
            new JsBarcode(renderElement, value, Object.assign({}, this.props));
            // eslint-disable-next-line react/destructuring-assignment
            setTimeout(() => this.props.onMount(), 0);
        } catch (e) {
            // prevent stop the parent process
            window.console.error(e);
        }
    }

    render() {
        const { renderer } = this.props;
        if (renderer === "svg") {
            return <svg ref={this.renderElementRef} />;
        } else if (renderer === "canvas") {
            return <canvas ref={this.renderElementRef} />;
        } else if (renderer === "img") {
            return <img ref={this.renderElementRef} />;
        }
    }
}

Barcode.defaultProps = {
    format: "CODE128",
    renderer: "svg",
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10,
    onMount: () => {},
};

export default Barcode;
