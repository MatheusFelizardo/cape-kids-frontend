import LevelConfigModal from "@/components/modals/LevelConfigModal";
import ModalBase from "@/components/modals/ModalBase";
import { Toggle } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";
import { StimuliBlockConfig } from "@/modules/timeline/types";
import { useMultiTriggerStimuliModal } from "@/stores/timeline/blockTypes/multiTriggerStimuliStore";
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const MultiTriggerStimuliConfigForm = () => {
  const { open, config, setConfig, updateStimulusStepsConfigField } =
    useMultiTriggerStimuliModal();

  const [showLevelModal, setShowLevelModal] = useState(false);

  if (!open) return null;

  const handleChange = <K extends keyof StimuliBlockConfig>(
    field: K,
    value: StimuliBlockConfig[K]
  ) => {
    setConfig({ [field]: value });
    updateStimulusStepsConfigField(field, value);
  };

  useEffect(() => {
    console.log("current config", config);
  }, [config]);

  return (
    <div className="flex w-full gap-16 border-b border-gray-300 pb-4">
      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center justify-between gap-4">
          <div className="flex min-w-[182px]">
            Number of Trials{" "}
            <Tooltip>
              Number of time that this block of stimulus will be repeated
            </Tooltip>
          </div>
          <input
            type="number"
            value={config.trials}
            onChange={(e) => handleChange("trials", Number(e.target.value))}
            className="w-full border rounded px-2 py-1 mt-1 flex-1"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[182px]">
            Stimuli Duration (ms)
            <Tooltip>Time that each stimulus is shown on the screen</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.stimulusDuration !== null}
              onChange={() => {
                if (!config.stimulusDuration) {
                  handleChange("stimulusDuration", 2000);
                } else {
                  handleChange("stimulusDuration", null);
                }
              }}
            />
            {config.stimulusDuration === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            ) : (
              <input
                type="number"
                value={config.stimulusDuration}
                onChange={(e) =>
                  handleChange("stimulusDuration", Number(e.target.value))
                }
                className="w-full border rounded px-2 py-1 mt-1 flex-1"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[165px]">
            Inter Stimuli Interval (ms)
            <Tooltip>Time between one stimuli and another</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.interStimulusInterval !== null}
              onChange={() => {
                if (!config.interStimulusInterval) {
                  handleChange("interStimulusInterval", 1000);
                } else {
                  handleChange("interStimulusInterval", null);
                }
              }}
            />

            {config.interStimulusInterval === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            ) : (
              <input
                type="number"
                value={config.interStimulusInterval}
                onChange={(e) =>
                  handleChange("interStimulusInterval", Number(e.target.value))
                }
                className="w-full border rounded px-2 py-1 mt-1 flex-1"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-[181px]">
            Level
            <Tooltip>Enable settings for handle with level</Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.isLevel !== false}
              onChange={() => {
                if (!config.isLevel) {
                  handleChange("isLevel", true);
                } else {
                  handleChange("isLevel", false);
                  handleChange("level", {
                    level: "",
                    repeatAmount: undefined,
                    onWrongAnswer: undefined,
                    repeatOnWrong: undefined,
                    goToStepId: undefined,
                  });
                }
              }}
            />

            {config.isLevel ? (
              <button
                className="w-full border rounded px-2 py-1 mt-1 flex-1 cursor-pointer flex items-center justify-center gap-1"
                onClick={() => setShowLevelModal(true)}
              >
                <span>Settings</span>
                <Settings className="inline ml-1 h-4 w-4" />
              </button>
            ) : (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            )}

            {showLevelModal && (
              <LevelConfigModal
                setShowLevelModal={setShowLevelModal}
                config={config}
                setConfig={setConfig}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col gap-2">
        <label className="flex items-center gap-4">
          <div className="min-w-[192px]">
            Practice
            <Tooltip>
              If enabled, the block will be used for practice trials. This will
              not affect the data collection, but it will be used to display as
              practice trials in the UI.
            </Tooltip>
          </div>
          <Toggle
            checked={config.isPractice}
            onChange={(value) => handleChange("isPractice", value)}
          />
        </label>

        <label className="flex items-center gap-4">
          <div className="min-w-[192px]">
            Advance on wrong answer
            <Tooltip>
              If enabled, the block will advance to the next trial if the
              participant answers incorrectly. If disabled, the block will wait
              for the participant to answer correctly before advancing.
            </Tooltip>
          </div>
          <Toggle
            checked={config.advanceOnWrong}
            onChange={(value) => handleChange("advanceOnWrong", value)}
          />
        </label>

        <div className="flex items-center gap-4 ">
          <div className="min-w-[192px]">
            Show Feedback
            <Tooltip>
              Enable to display a feedback after the user interaction.
            </Tooltip>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <Toggle
              checked={config.feedbackDuration !== null}
              onChange={(value) => {
                if (!config.feedbackDuration) {
                  handleChange("feedbackDuration", 1000);
                } else {
                  handleChange("feedbackDuration", null);
                }
              }}
            />
            {config.feedbackDuration === null ? (
              <div className="w-full border rounded px-2 py-1 mt-1 flex-1">
                Disabled
              </div>
            ) : (
              <div className="relative flex-1 max-w-26">
                <input
                  type="number"
                  value={config.feedbackDuration}
                  onChange={(e) => {
                    if (+e.target.value > 10000) {
                      toast.error(
                        "Feedback duration cannot be greater than 10 seconds"
                      );
                      handleChange("feedbackDuration", Number(10000));
                      return;
                    }
                    handleChange("feedbackDuration", Number(e.target.value));
                  }}
                  className="w-full border rounded px-2 py-1 mt-1 flex-1 "
                />
                <span className="text-sm text-gray-500 absolute right-8 bottom-[5px] pointer-events-none">
                  ms
                </span>
              </div>
            )}
          </div>
        </div>

        <label className="flex items-center gap-4">
          <div className="min-w-[192px]">
            Randomize Order
            <Tooltip>
              This will randomize the order of the stimuli in each trial
            </Tooltip>
          </div>
          <Toggle
            checked={config.randomize}
            onChange={(value) => handleChange("randomize", value)}
          />
        </label>
      </div>
    </div>
  );
};

export default MultiTriggerStimuliConfigForm;
