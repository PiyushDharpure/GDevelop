// @flow
const gd: libGDevelop = global.gd;

// Instruction or expression can be private (see IsPrivate, SetPrivate).
// Their visibility will change according to the scope (i.e: if we're
// editing events in a behavior, private instructions of the behavior
// will be visible).
export type EventsScope = {|
  project: gdProject,
  layout?: ?gdLayout,
  externalEvents?: ?gdExternalEvents,
  eventsFunctionsExtension?: gdEventsFunctionsExtension,
  eventsBasedBehavior?: ?gdEventsBasedBehavior,
  eventsBasedObject?: ?gdEventsBasedObject,
  eventsFunction?: gdEventsFunction,
|};

export const getProjectScopedContainersFromScope = (
  scope: EventsScope,
  globalObjectsContainer: gdObjectsContainer,
  objectsContainer: gdObjectsContainer
): gdProjectScopedContainers => {
  const {
    project,
    layout,
    eventsBasedBehavior,
    eventsBasedObject,
    eventsFunction,
  } = scope;
  if (layout) {
    return gd.ProjectScopedContainers.makeNewProjectScopedContainersForProjectAndLayout(
      project,
      layout
    );
  }

  const projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersFor(
    globalObjectsContainer,
    objectsContainer
  );

  if (eventsBasedBehavior) {
    projectScopedContainers.addPropertiesContainer(
      eventsBasedBehavior.getSharedPropertyDescriptors()
    );
    projectScopedContainers.addPropertiesContainer(
      eventsBasedBehavior.getPropertyDescriptors()
    );
  }

  if (eventsBasedObject) {
    projectScopedContainers.addPropertiesContainer(
      eventsBasedObject.getPropertyDescriptors()
    );
  }

  if (eventsFunction) {
    projectScopedContainers.addParameters(eventsFunction.getParameters());
  }

  return projectScopedContainers;
};
