interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export function Progress({ currentStep, totalSteps, steps }: ProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* 진행률 바 */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between items-center">
        {steps ? (
          steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600 text-white scale-110'
                      : isCompleted
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <p className={`
                  mt-2 text-xs font-medium text-center
                  ${isActive ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-600">
            {currentStep} / {totalSteps}
          </p>
        )}
      </div>
    </div>
  );
}
