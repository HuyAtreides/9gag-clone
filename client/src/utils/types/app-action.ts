export type AppAction<ActionType> = {
  readonly payload?: unknown;
  readonly type: ActionType;
};

export type AppActionCreator = (value: any) => AppAction<any>;
