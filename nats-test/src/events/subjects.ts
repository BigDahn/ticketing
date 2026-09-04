export enum Subjects {
  TicketCreated = 'ticket:created',
  OrderUpdated = 'order:updated',
}

// An enum is a way of giving more friendly names to sets of numeric values. In this case, we are using an enum to define the subjects for our events. The Subjects enum has two members: TicketCreated and OrderUpdated. Each member is assigned a string value that represents the subject of the event. This allows us to use the enum members in our code instead of hardcoding the string values, which can help prevent typos and make our code more maintainable.
