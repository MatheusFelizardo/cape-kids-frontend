import { create } from "zustand";
import { API } from "@/utils/api";
import {
  CreateExperimentSchemaType,
  ExperimentSchemaWithTimelineType,
} from "@shared/experiments";
import { toast } from "sonner";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { useAuthStore } from "../auth/useAuthStore";
import {
  ParticipantSchemaType,
  ResearcherMetadataSchemaType,
} from "@shared/user";

interface ExperimentParticipantSchemaFe {
  id: string;
  createdAt: string;
  completedAt: string | null;
  user: {
    id: string;
    email: string;
    role: string;
    profile: ParticipantSchemaType;
  };
}

interface ExperimentScientistSchemaFe {
  id: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile: ResearcherMetadataSchemaType;
  };
}

interface ExperimentsState {
  experiments: ExperimentSchemaWithTimelineType[];
  setExperiments: (experiments: ExperimentSchemaWithTimelineType[]) => void;
  createExperiment: (
    token: string,
    data: CreateExperimentSchemaType
  ) => Promise<RestResponseSchemaType>;
  getUserExperiments: (
    token: string
  ) => Promise<ExperimentSchemaWithTimelineType[]>;
  getExperimentById: (id: string) => Promise<RestResponseSchemaType>;
  selectedExperiment: ExperimentSchemaWithTimelineType | null;
  selectedExperimentParticipants: ExperimentParticipantSchemaFe[];
  selectedExperimentScientists: ExperimentScientistSchemaFe[];
  setSelectedExperiment: (
    experiment: ExperimentSchemaWithTimelineType | null
  ) => void;
  joinExperiment: (
    experimentId: string,
    userId: string,
    accessCode: string
  ) => Promise<RestResponseSchemaType>;
  addParticipantToExperiment: (
    experimentId: string,
    userId: string
  ) => Promise<RestResponseSchemaType>;
  getExperimentParticipants: (
    experimentId: string
  ) => Promise<RestResponseSchemaType>;
  getUserExperimentResult: (
    userId: string,
    experimentId: string
  ) => Promise<RestResponseSchemaType>;
  getExperimentScientists: (
    experimentId: string
  ) => Promise<RestResponseSchemaType>;
  clearExperiments: () => void;
}
export const useExperimentsStore = create<ExperimentsState>((set, get) => ({
  experiments: [],
  setExperiments: (experiments: ExperimentSchemaWithTimelineType[]) => {
    set({ experiments });
  },
  selectedExperiment: null,
  selectedExperimentParticipants: [],
  selectedExperimentScientists: [],
  setSelectedExperiment: (
    experiment: ExperimentSchemaWithTimelineType | null
  ) => {
    set({ selectedExperiment: experiment });
  },
  createExperiment: async (token, data) => {
    const request = await fetch(API.CREATE_EXPERIMENT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.error) {
      set({ selectedExperiment: null });
      return response;
    }
    set({ selectedExperiment: response.data });
    set({ experiments: [...get().experiments, response.data] });
    return response;
  },
  getUserExperiments: async (token: string) => {
    const { experiments } = get();
    if (experiments.length > 0) return experiments;

    try {
      const request = await fetch(API.GET_USER_EXPERIMENTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      if (response.error) {
        set({ experiments: [] });
        return experiments;
      }
      set({ experiments: response.data });
      return response.data;
    } catch (error) {
      set({ experiments: [] });
      toast.error("Error fetching experiments");
      return [];
    }
  },

  getExperimentById: async (id: string) => {
    const { authState } = useAuthStore.getState();
    if (!authState.token) return;

    const request = await fetch(`${API.EXPERIMENT_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });

    const response = await request.json();
    return response;
  },

  joinExperiment: async (
    experimentId: string,
    userId: string,
    accessCode: string
  ) => {
    const { authState } = useAuthStore.getState();

    const request = await fetch(API.JOIN_EXPERIMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify({
        experimentId,
        userId,
        accessCode,
      }),
    });

    const response = await request.json();
    return response;
  },

  addParticipantToExperiment: async (experimentId: string, userId: string) => {
    const { authState } = useAuthStore.getState();

    const request = await fetch(API.ADD_EXPERIMENT_PARTICIPANT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify({
        experimentId,
        userId,
      }),
    });

    const response = await request.json();
    return response;
  },

  getExperimentParticipants: async (experimentId: string) => {
    const { authState } = useAuthStore.getState();
    if (!authState.token) return;

    const request = await fetch(
      `${API.GET_EXPERIMENT_PARTICIPANTS(experimentId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      }
    );

    const response = await request.json();
    if (!response.error) {
      set({ selectedExperimentParticipants: response.data });
    }
    return response;
  },
  getUserExperimentResult: async (userId: string, experimentId: string) => {
    const { authState } = useAuthStore.getState();

    const request = await fetch(
      API.GET_USER_EXPERIMENT_RESULT(userId, experimentId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      }
    );

    const response = await request.json();
    return response;
  },
  getExperimentScientists: async (experimentId: string) => {
    const { authState } = useAuthStore.getState();
    if (!authState.token) return;

    const request = await fetch(
      `${API.GET_EXPERIMENT_SCIENTISTS(experimentId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      }
    );

    const response = await request.json();
    if (!response.error) {
      set({ selectedExperimentScientists: response.data });
    }
    return response;
  },
  clearExperiments: () => set({ experiments: [], selectedExperiment: null }),
}));
