/**
 * @file PropertyFieldDropDownSelect.ts
 * Define a custom field of type PropertyFieldDropDownSelect for
 * the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPropertyPaneField, PropertyPaneFieldType, IPropertyPaneCustomFieldProps } from "@microsoft/sp-webpart-base";
import PropertyFieldDropDownSelectHost, { IPropertyFieldDropDownSelectHostProps } from "./PropertyFieldDropDownSelectHost";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

/**
 * @interface
 * Public properties of the PropertyFieldDropDownSelect custom field
 *
 */
export interface IPropertyFieldDropDownSelectProps {
  /**
   * @var
   * Property field label displayed on top
   */
  label: string;
  /**
   * @var
   * Initial value
   */
  initialValue?: string[];
  /**
   * @var
   * Dropdown options
   */
  options: IDropdownOption[];
  /**
   * @function
   * Defines a onPropertyChange function to raise when the selected Font changed.
   * Normally this function must be always defined with the 'this.onPropertyChange'
   * method of the web part object.
   */
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  /**
   * @function
   * This API is called to render the web part.
   * Normally this function must be always defined with the 'this.render.bind(this)'
   * method of the web part object.
   */
  render(): void;
  /**
   * This property is used to indicate the web part's PropertyPane interaction mode: Reactive or NonReactive.
   * The default behaviour is Reactive.
   */
  disableReactivePropertyChanges?: boolean;
  /**
   * @var
   * Parent Web Part properties
   */
  properties: any;
  /**
   * @var
   * An UNIQUE key indicates the identity of this control
   */
  key?: string;
  /**
   * Whether the property pane field is enabled or not.
   */
  disabled?: boolean;
  /**
   * The method is used to get the validation error message and determine whether the input value is valid or not.
   *
   *   When it returns string:
   *   - If valid, it returns empty string.
   *   - If invalid, it returns the error message string and the text field will
   *     show a red border and show an error message below the text field.
   *
   *   When it returns Promise<string>:
   *   - The resolved value is display as error message.
   *   - The rejected, the value is thrown away.
   *
   */
  onGetErrorMessage?: (value: string[]) => string | Promise<string>;
  /**
   * Custom Field will start to validate after users stop typing for `deferredValidationTime` milliseconds.
   * Default value is 200.
   */
  deferredValidationTime?: number;
}

/**
 * @interface
 * Private properties of the PropertyFieldDropDownSelect custom field.
 * We separate public & private properties to include onRender & onDispose method waited
 * by the PropertyFieldCustom, witout asking to the developer to add it when he's using
 * the PropertyFieldDropDownSelect.
 *
 */
export interface IPropertyFieldDropDownSelectPropsInternal extends IPropertyPaneCustomFieldProps {
  label: string;
  initialValue?: string[];
  targetProperty: string;
  options: IDropdownOption[];
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  render(): void;
  disableReactivePropertyChanges?: boolean;
  properties: any;
  disabled?: boolean;
  onGetErrorMessage?: (value: string[]) => string | Promise<string>;
  deferredValidationTime?: number;
}

/**
 * @interface
 * Represents a PropertyFieldDropDownSelect object
 *
 */
class PropertyFieldDropDownSelectBuilder implements IPropertyPaneField<IPropertyFieldDropDownSelectPropsInternal> {
  //Properties defined by IPropertyPaneField
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldDropDownSelectPropsInternal;

  //Custom properties
  private label: string;
  private initialValue: string[];
  private options: IDropdownOption[];
  private onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  private customProperties: any;
  private key: string;
  private disabled: boolean = false;
  private onGetErrorMessage: (value: string[]) => string | Promise<string>;
  private deferredValidationTime: number = 200;
  private renderWebPart: () => void;
  private disableReactivePropertyChanges: boolean = false;

  /**
   * @function
   * Ctor
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldDropDownSelectPropsInternal) {
    this.render = this.render.bind(this);
    this.targetProperty = _properties.targetProperty;
    this.properties = _properties;
    this.label = _properties.label;
    this.initialValue = _properties.initialValue;
    this.options = _properties.options;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.onPropertyChange = _properties.onPropertyChange;
    this.customProperties = _properties.properties;
    this.key = _properties.key;
    if (_properties.disabled === true) this.disabled = _properties.disabled;
    this.onGetErrorMessage = _properties.onGetErrorMessage;
    if (_properties.deferredValidationTime !== undefined) this.deferredValidationTime = _properties.deferredValidationTime;
    this.renderWebPart = _properties.render;
    if (_properties.disableReactivePropertyChanges !== undefined && _properties.disableReactivePropertyChanges != null)
      this.disableReactivePropertyChanges = _properties.disableReactivePropertyChanges;
  }

  /**
   * @function
   * Renders the field content
   */
  private render(elem: HTMLElement): void {
    //Construct the JSX properties
    const element: React.ReactElement<IPropertyFieldDropDownSelectHostProps> = React.createElement(PropertyFieldDropDownSelectHost, {
      label: this.label,
      initialValue: this.initialValue,
      targetProperty: this.targetProperty,
      options: this.options,
      onDispose: this.dispose,
      onRender: this.render,
      onPropertyChange: this.onPropertyChange,
      properties: this.customProperties,
      key: this.key,
      disabled: this.disabled,
      onGetErrorMessage: this.onGetErrorMessage,
      deferredValidationTime: this.deferredValidationTime,
      render: this.renderWebPart,
      disableReactivePropertyChanges: this.disableReactivePropertyChanges,
    });
    //Calls the REACT content generator
    ReactDom.render(element, elem);
  }

  /**
   * @function
   * Disposes the current object
   */
  private dispose(elem: HTMLElement): void {}
}

/**
 * @function
 * Helper method to create a Font Picker on the PropertyPane.
 * @param targetProperty - Target property the Font picker is associated to.
 * @param properties - Strongly typed Font Picker properties.
 */
export function PropertyFieldDropDownSelect(
  targetProperty: string,
  properties: IPropertyFieldDropDownSelectProps
): IPropertyPaneField<IPropertyFieldDropDownSelectPropsInternal> {
  //Create an internal properties object from the given properties
  var newProperties: IPropertyFieldDropDownSelectPropsInternal = {
    label: properties.label,
    targetProperty: targetProperty,
    initialValue: properties.initialValue,
    options: properties.options,
    onPropertyChange: properties.onPropertyChange,
    properties: properties.properties,
    onDispose: null,
    onRender: null,
    key: properties.key,
    disabled: properties.disabled,
    onGetErrorMessage: properties.onGetErrorMessage,
    deferredValidationTime: properties.deferredValidationTime,
    render: properties.render,
    disableReactivePropertyChanges: properties.disableReactivePropertyChanges,
  };
  //Calls the PropertyFieldDropDownSelect builder object
  //This object will simulate a PropertyFieldCustom to manage his rendering process
  return new PropertyFieldDropDownSelectBuilder(targetProperty, newProperties);
}
