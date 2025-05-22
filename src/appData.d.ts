// The first type is the one for the directly generated data
export type AppDataItem = {
    id: string;
    timestamp: string;
    value: number | null;
    parameter_set: string;
    status: string;
}
//This second type is for the augmented data, primarily for the performance index, but also allows for value to be "N/A" instead of null
export type AppDataItemAug = {
    id: string;
    timestamp: string;
    value: number | null | string;
    parameter_set: string;
    status: string;
    performance_index: number;
}

//These types are just for the sake of clarity, making it clear in references that they are arrays of the above types
export type AppData = AppDataItem[];
export type AppDataAug = AppDataItemAug[];
