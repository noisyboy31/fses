import create from "zustand";

export const useAuthStore = create((set) => ({
  auth: {
    username: "",
    active: false,
    position: "", // Add the position property
  },
  setUsername: (name) =>
    set((state) => ({ auth: { ...state.auth, username: name } })),
  setPosition: (position) =>
    set((state) => ({ auth: { ...state.auth, position: position } })), // Add the setPosition function
}));
