import { expect } from "@jest/globals";
import { Version } from "./Version";

function areVersionsEqual(a: unknown, b: unknown): boolean | undefined {
    const isAVersion = a instanceof Version;
    const isBVersion = b instanceof Version;

    if (isAVersion && isBVersion) {
        return a.equals(b);
    } else if (isAVersion === isBVersion) {
        return undefined;
    } else {
        return false;
    }
}

expect.addEqualityTesters([areVersionsEqual]);






main -> branch-name (pr krke dikhaya)
     

main -> pr2 (pr2 doesn't have any changes you made on branch-name, it is a fresh copy of main )



I am ritankar
    