import { useState, useCallback } from 'react'
import type { GenerationConfig, GenerationState, CaseData } from '../types/report.types'

const INITIAL_STATE: GenerationState = {
    status: 'idle',
    progress: 0,
    message: '',
}

export function useDocumentGeneration() {
    const [state, setState] = useState<GenerationState>(INITIAL_STATE)

    const simulateProgress = useCallback(
        (messages: string[]): Promise<void> => {
            return new Promise((resolve) => {
                let step = 0
                const totalSteps = messages.length

                const interval = setInterval(() => {
                    if (step >= totalSteps) {
                        clearInterval(interval)
                        resolve()
                        return
                    }

                    setState((prev) => ({
                        ...prev,
                        status: 'processing',
                        progress: Math.round(((step + 1) / totalSteps) * 90),
                        message: messages[step],
                    }))

                    step++
                }, 800)
            })
        },
        []
    )

    const generateDocument = useCallback(
        async (caseData: CaseData, config: GenerationConfig) => {
            try {
                setState({
                    status: 'processing',
                    progress: 0,
                    message: 'Initializing document generation...',
                })

                const messages = [
                    'Loading case data...',
                    'Building document structure...',
                    config.includeTableOfContents
                        ? 'Generating table of contents...'
                        : 'Skipping table of contents...',
                    'Rendering report sections...',
                    ...caseData.sections
                        .filter((s) => s.enabled)
                        .map((s) => `Processing section: ${s.title}...`),
                    config.includePhotos
                        ? `Embedding ${caseData.photos.length} photos...`
                        : 'Skipping photos...',
                    'Applying compliance formatting...',
                    'Finalizing document...',
                ]

                await simulateProgress(messages)

                // Simulate final document URL
                const mockUrl = `#mock-document-${config.format}-${caseData.caseNumber}`

                setState({
                    status: 'completed',
                    progress: 100,
                    message: `Document generated successfully! (${config.format.toUpperCase()})`,
                    downloadUrl: mockUrl,
                })
            } catch {
                setState({
                    status: 'error',
                    progress: 0,
                    message: 'An error occurred while generating the document. Please try again.',
                })
            }
        },
        [simulateProgress]
    )

    const reset = useCallback(() => {
        setState(INITIAL_STATE)
    }, [])

    return {
        state,
        generateDocument,
        reset,
    }
}