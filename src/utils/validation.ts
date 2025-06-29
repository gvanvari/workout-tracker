export const validatePositiveInteger = (value: number): boolean => {
    return Number.isInteger(value) && value > 0;
};

export const validateRPE = (rpe: number): boolean => {
    return validatePositiveInteger(rpe) && rpe <= 10;
};

export const validateSetNumber = (setNumber: number): boolean => {
    return validatePositiveInteger(setNumber);
};