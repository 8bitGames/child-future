import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
  steps: string[]
  className?: string
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {/* 왼쪽 라인 */}
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    index === 0 ? "bg-transparent" : isCompleted || isCurrent ? "bg-primary" : "bg-gray-200"
                  )}
                />

                {/* 스텝 원 */}
                <div
                  className={cn(
                    "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium shrink-0",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* 오른쪽 라인 */}
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    index === steps.length - 1 ? "bg-transparent" : isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                />
              </div>

              {/* 라벨 */}
              <span
                className={cn(
                  "mt-1.5 text-[10px] sm:text-xs text-center leading-tight",
                  isCurrent || isCompleted
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
