/**
 * @file PropertyFieldSPListQuery.ts
 * Define a custom field of type PropertyFieldSPListQuery for
 * the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 *
 */
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-webpart-base";
import PropertyFieldSPListQueryHost, { IPropertyFieldSPListQueryHostProps } from "./PropertyFieldSPListQueryHost";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export enum PropertyFieldSPListQueryOrderBy {
  Id = 0,
  Title = 1,
}

/**
 * @interface
 * Public properties of the PropertyFieldSPListQuery custom field
 *
 */
export interface IPropertyFieldSPListQueryProps {
  /**
   * @var
   * Property field label displayed on top
   */
  label: string;
  context: WebPartContext;
  query?: string;
  baseTemplate?: number;
  includeHidden?: boolean;
  orderBy?: PropertyFieldSPListQueryOrderBy;
  showOrderBy?: boolean;
  showMax?: boolean;
  showFilters?: boolean;
  max?: number;
  /**
   * @function
   * Defines a onPropertyChange function to raise when the selected value changed.
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
  onGetErrorMessage?: (value: string) => string | Promise<string>;
  /**
   * Custom Field will start to validate after users stop typing for `deferredValidationTime` milliseconds.
   * Default value is 200.
   */
  deferredValidationTime?: number;
}

/**
 * @interface
 * Private properties of the PropertyFieldSPListQuery custom field.
 * We separate public & private properties to include onRender & onDispose method waited
 * by the PropertyFieldCustom, witout asking to the developer to add it when he's using
 * the PropertyFieldSPListQuery.
 *
 */
export interface IPropertyFieldSPListQueryPropsInternal extends IPropertyFieldSPListQueryProps {
  label: string;
  targetProperty: string;
  context: WebPartContext;
  query?: string;
  baseTemplate?: number;
  orderBy?: PropertyFieldSPListQueryOrderBy;
  includeHidden?: boolean;
  showOrderBy?: boolean;
  showMax?: boolean;
  showFilters?: boolean;
  max?: number;
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  render(): void;
  disableReactivePropertyChanges?: boolean;
  properties: any;
  key: string;
  disabled?: boolean;
  onGetErrorMessage?: (value: string) => string | Promise<string>;
  deferredValidationTime?: number;
}

/**
 * @interface
 * Represents a PropertyFieldSPListQuery object
 *
 */
class PropertyFieldSPListQueryBuilder implements IPropertyPaneField<IPropertyFieldSPListQueryPropsInternal> {
  //Properties defined by IPropertyPaneField
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldSPListQueryPropsInternal;

  //Custom properties label: string;
  private label: string;
  private context: WebPartContext;
  private query: string;
  private baseTemplate: number;
  private orderBy: PropertyFieldSPListQueryOrderBy;
  private includeHidden: boolean;
  private showOrderBy: boolean;
  private showMax: boolean;
  private showFilters: boolean;
  private max: number;
  public onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void {}
  private customProperties: any;
  private key: string;
  private disabled: boolean = false;
  private onGetErrorMessage: (value: string) => string | Promise<string>;
  private deferredValidationTime: number = 200;
  private renderWebPart: () => void;
  private disableReactivePropertyChanges: boolean = false;

  /**
   * @function
   * Ctor
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldSPListQueryPropsInternal) {
    this.render = this.render.bind(this);
    this.targetProperty = _targetProperty;
    this.properties = _properties;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.label = _properties.label;
    this.context = _properties.context;
    this.query = _properties.query;
    this.baseTemplate = _properties.baseTemplate;
    this.orderBy = _properties.orderBy;
    this.includeHidden = _properties.includeHidden;
    this.showOrderBy = _properties.showOrderBy;
    this.showMax = _properties.showMax;
    this.showFilters = _properties.showFilters;
    this.max = _properties.max;
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
   * Renders the SPListPicker field content
   */
  private render(elem: HTMLElement): void {
    //Construct the JSX properties
    const element: React.ReactElement<IPropertyFieldSPListQueryHostProps> = React.createElement(PropertyFieldSPListQueryHost, {
      label: this.label,
      targetProperty: this.targetProperty,
      context: this.context,
      query: this.query,
      baseTemplate: this.baseTemplate,
      orderBy: this.orderBy,
      includeHidden: this.includeHidden,
      showOrderBy: this.showOrderBy,
      showMax: this.showMax,
      showFilters: this.showFilters,
      max: this.max,
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
 * Helper method to create a SPList Picker on the PropertyPane.
 * @param targetProperty - Target property the SharePoint list picker is associated to.
 * @param properties - Strongly typed SPList Picker properties.
 */
export function PropertyFieldSPListQuery(
  targetProperty: string,
  properties: IPropertyFieldSPListQueryProps
): IPropertyPaneField<IPropertyFieldSPListQueryPropsInternal> {
  //Create an internal properties object from the given properties
  var newProperties: IPropertyFieldSPListQueryPropsInternal = {
    label: properties.label,
    targetProperty: targetProperty,
    context: properties.context,
    query: properties.query,
    baseTemplate: properties.baseTemplate,
    orderBy: properties.orderBy,
    includeHidden: properties.includeHidden,
    showOrderBy: properties.showOrderBy,
    showMax: properties.showMax,
    showFilters: properties.showFilters,
    max: properties.max,
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
  //Calls the PropertyFieldSPListQuery builder object
  //This object will simulate a PropertyFieldCustom to manage his rendering process
  return new PropertyFieldSPListQueryBuilder(targetProperty, newProperties);
}
