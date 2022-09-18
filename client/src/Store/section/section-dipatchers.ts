import { AppThunk } from "..";
import { getSections } from "../../services/section-service";
import { handleError } from "../../utils/error-handler";
import { setIsLoading, setSection, setSections, setUserErrorMessage } from "./section-slice";

export const getAllSection = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(setIsLoading(true));
        const section = await getSections();
        dispatch(setSections(section));
        dispatch(setIsLoading(false));
    } catch (err: unknown) {
        handleError(dispatch, err, setUserErrorMessage);
        dispatch(setIsLoading(false));
    }
};