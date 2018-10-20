/**
 * @file PropertyFieldDisplayModeHost.tsx
 * Renders the controls for PropertyFieldDisplayMode component
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from "react";
import { IPropertyFieldDisplayModePropsInternal } from "./PropertyFieldDisplayMode";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Async } from "office-ui-fabric-react/lib/Utilities";
import styles from "./PropertyFields.module.scss";
import GuidHelper from "./GuidHelper";

/**
 * @interface
 * PropertyFieldDisplayModeHost properties interface
 *
 */
export interface IPropertyFieldDisplayModeHostProps extends IPropertyFieldDisplayModePropsInternal {}

export interface IPropertyFieldDisplayModeHostState {
  mode?: string;
  overList?: boolean;
  overTiles?: boolean;
  errorMessage?: string;
}

/**
 * @class
 * Renders the controls for PropertyFieldDisplayMode component
 */
export default class PropertyFieldDisplayModeHost extends React.Component<IPropertyFieldDisplayModeHostProps, IPropertyFieldDisplayModeHostState> {
  private latestValidateValue: string;
  private async: Async;
  private delayedValidate: (value: string) => void;
  private _key: string;

  /**
   * @function
   * Constructor
   */
  constructor(props: IPropertyFieldDisplayModeHostProps) {
    super(props);
    //Bind the current object to the external called onSelectDate method
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onClickBullets = this.onClickBullets.bind(this);
    this.onClickTiles = this.onClickTiles.bind(this);
    this.mouseListEnterDropDown = this.mouseListEnterDropDown.bind(this);
    this.mouseListLeaveDropDown = this.mouseListLeaveDropDown.bind(this);
    this.mouseTilesEnterDropDown = this.mouseTilesEnterDropDown.bind(this);
    this.mouseTilesLeaveDropDown = this.mouseTilesLeaveDropDown.bind(this);
    this._key = GuidHelper.getGuid();

    this.state = {
      mode: this.props.initialValue != null && this.props.initialValue != "" ? this.props.initialValue : "",
      overList: false,
      overTiles: false,
      errorMessage: "",
    };

    this.async = new Async(this);
    this.validate = this.validate.bind(this);
    this.notifyAfterValidate = this.notifyAfterValidate.bind(this);
    this.delayedValidate = this.async.debounce(this.validate, this.props.deferredValidationTime);
  }

  /**
   * @function
   * Function called when the selected value changed
   */
  private onValueChanged(element: any, value: string): void {
    this.delayedValidate(value);
  }

  /**
   * @function
   * Validates the new custom field value
   */
  private validate(value: string): void {
    if (this.props.onGetErrorMessage === null || this.props.onGetErrorMessage === undefined) {
      this.notifyAfterValidate(this.props.initialValue, value);
      return;
    }

    if (this.latestValidateValue === value) return;
    this.latestValidateValue = value;

    var result: string | PromiseLike<string> = this.props.onGetErrorMessage(value || "");
    if (result !== undefined) {
      if (typeof result === "string") {
        if (result === undefined || result === "") this.notifyAfterValidate(this.props.initialValue, value);
        this.setState({ errorMessage: result });
      } else {
        result.then((errorMessage: string) => {
          if (errorMessage === undefined || errorMessage === "") this.notifyAfterValidate(this.props.initialValue, value);
          this.setState({ errorMessage });
        });
      }
    } else {
      this.notifyAfterValidate(this.props.initialValue, value);
    }
  }

  /**
   * @function
   * Notifies the parent Web Part of a property value change
   */
  private notifyAfterValidate(oldValue: string, newValue: string) {
    if (this.props.onPropertyChange && newValue != null) {
      this.props.properties[this.props.targetProperty] = newValue;
      this.props.onPropertyChange(this.props.targetProperty, oldValue, newValue);
      if (!this.props.disableReactivePropertyChanges && this.props.render != null) this.props.render();
    }
  }

  /**
   * @function
   * Called when the component will unmount
   */
  public componentWillUnmount() {
    this.async.dispose();
  }

  private onClickBullets(element?: any) {
    this.setState({
      mode: "list",
    });
    this.onValueChanged(this, this.state.mode);
  }

  private onClickTiles(element?: any) {
    this.setState({
      mode: "tiles",
    });
    this.onValueChanged(this, this.state.mode);
  }

  private mouseListEnterDropDown() {
    if (this.props.disabled === true) return;
    this.setState({
      overList: true,
    });
  }

  private mouseListLeaveDropDown() {
    if (this.props.disabled === true) return;
    this.setState({
      overList: false,
    });
  }

  private mouseTilesEnterDropDown() {
    if (this.props.disabled === true) return;
    this.setState({
      overTiles: true,
    });
  }

  private mouseTilesLeaveDropDown() {
    if (this.props.disabled === true) return;
    this.setState({
      overTiles: false,
    });
  }

  /**
   * @function
   * Renders the control
   */
  public render(): JSX.Element {
    var backgroundTiles = this.state.overTiles ? "#DFDFDF" : "";
    var backgroundLists = this.state.overList ? "#DFDFDF" : "";
    if (this.state.mode == "list") backgroundLists = "#EEEEEE";
    if (this.state.mode == "tiles") backgroundTiles = "#EEEEEE";

    var styleList = styles["spcfChoiceFieldField"];
    var styleTiles = styles["spcfChoiceFieldField"];
    if (this.state.mode === "list") styleList += " is-checked";
    else if (this.state.mode === "tiles") styleTiles += " is-checked";
    if (this.props.disabled === true) {
      styleList += " is-disabled";
      styleTiles += " is-disabled";
    }
    //Renders content
    return (
      <div style={{ marginBottom: "8px" }}>
        <Label>{this.props.label}</Label>

        <div style={{ display: "inline-flex" }}>
          <div
            style={{
              cursor: this.props.disabled === false ? "pointer" : "default",
              width: "100px",
              marginRight: "30px",
              paddingLeft: "8px",
              backgroundColor: backgroundLists,
            }}
            onMouseEnter={this.mouseListEnterDropDown}
            onMouseLeave={this.mouseListLeaveDropDown}
          >
            <div style={{ float: "left" }} className={styles["spcfChoiceField"]}>
              <input
                id={"bulletRadio-" + this._key}
                className={styles["spcfChoiceFieldInput"]}
                onChange={this.onClickBullets}
                type="radio"
                name={"display-mode-" + this._key}
                role="radio"
                disabled={this.props.disabled}
                defaultChecked={this.state.mode == "list" ? true : false}
                aria-checked={this.state.mode == "list" ? true : false}
                value="list"
                style={{ cursor: this.props.disabled === false ? "pointer" : "default", width: "18px", height: "18px", opacity: 0 }}
              />
              <label htmlFor={"bulletRadio-" + this._key} className={styleList}>
                <div className={styles["spcfChoiceFieldInnerField"]}>
                  <div className={styles["spcfChoiceFieldIconWrapper"]}>
                    <i
                      className="ms-Icon ms-Icon--List"
                      aria-hidden="true"
                      style={{
                        cursor: this.props.disabled === false ? "pointer" : "default",
                        fontSize: "60px",
                        paddingLeft: "30px",
                        color: this.props.disabled === false ? "#808080" : "#A6A6A6",
                      }}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div
            style={{
              cursor: this.props.disabled === false ? "pointer" : "default",
              width: "100px",
              marginRight: "30px",
              paddingLeft: "8px",
              backgroundColor: backgroundTiles,
            }}
            onMouseEnter={this.mouseTilesEnterDropDown}
            onMouseLeave={this.mouseTilesLeaveDropDown}
          >
            <div style={{ float: "left" }} className={styles["spcfChoiceField"]}>
              <input
                id={"tilesRadio-" + this._key}
                className={styles["spcfChoiceFieldInput"]}
                onChange={this.onClickTiles}
                type="radio"
                name={"display-mode-" + this._key}
                role="radio"
                disabled={this.props.disabled}
                defaultChecked={this.state.mode == "tiles" ? true : false}
                aria-checked={this.state.mode == "tiles" ? true : false}
                value="tiles"
                style={{ cursor: this.props.disabled === false ? "pointer" : "default", width: "18px", height: "18px", opacity: 0 }}
              />
              <label htmlFor={"tilesRadio-" + this._key} className={styleTiles}>
                <div className={styles["spcfChoiceFieldInnerField"]}>
                  <div className={styles["spcfChoiceFieldIconWrapper"]}>
                    <i
                      className="ms-Icon ms-Icon--Tiles"
                      aria-hidden="true"
                      style={{
                        cursor: this.props.disabled === false ? "pointer" : "default",
                        fontSize: "48px",
                        paddingLeft: "30px",
                        color: this.props.disabled === false ? "#808080" : "#A6A6A6",
                      }}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        {this.state.errorMessage != null && this.state.errorMessage != "" && this.state.errorMessage != undefined ? (
          <div>
            <div aria-live="assertive" className="ms-u-screenReaderOnly" data-automation-id="error-message">
              {this.state.errorMessage}
            </div>
            <span>
              <p className="ms-TextField-errorMessage ms-u-slideDownIn20">{this.state.errorMessage}</p>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
