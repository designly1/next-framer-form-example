export interface T_RegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courses: string[];
    ccNumber: string;
    ccExp: string;
    ccCvv: string;
}

export interface T_FormErrors {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courses: string;
    ccNumber: string;
    ccExp: string;
    ccCvv: string;
}

export type T_CurrentView = "contact" | "syllabus" | "payment" | "loading" | "confirmation";

export interface T_RegistrationFormContext {
    formData: T_RegistrationForm;
    setFormData: React.Dispatch<React.SetStateAction<T_RegistrationForm>>;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement> | T_SyllabusEvent) => void;
    handleSelectChange: (name: string, value: string[]) => void;
    currentView: T_CurrentView;
    setCurrentView: React.Dispatch<React.SetStateAction<T_CurrentView>>;
    nextView: () => void;
    previousView: () => void;
    formErrors: T_FormErrors;
    resetForm: () => void;
}

export interface T_FormProviderProps {
    children: ReactNode;
}

export interface T_RegistrationView {
    setCurrentView: React.Dispatch<React.SetStateAction<T_CurrentView>>;
}

export interface T_SyllabusEvent extends Event {
    target: {
        name: string,
        value: any
    }
}