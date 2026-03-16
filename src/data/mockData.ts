import type { CaseData } from '../types/report.types'

export const mockCaseData: CaseData = {
  id: 'case-001',
  caseNumber: 'FI-2026-0342',
  title: 'Commercial Building Fire Investigation',
  date: '2026-03-15',
  agency: 'Metro Fire Investigation Unit',
  investigator: 'Det. Sarah Johnson',
  location: '1234 Industrial Blvd, Metro City, CA 90210',
  sections: [
    {
      id: 'section-1',
      title: 'Executive Summary',
      enabled: true,
      content: `This report documents the investigation of a fire that occurred on March 15, 2026, 
      at a commercial warehouse located at 1234 Industrial Blvd. The fire was reported at 02:34 AM 
      and was brought under control by 04:15 AM. Estimated damage exceeds $2.3 million.`,
    },
    {
      id: 'section-2',
      title: 'Scene Examination',
      enabled: true,
      content: `Upon arrival at the scene, investigators observed significant fire damage concentrated 
      in the northeast corner of the building. Burn patterns on the floor and walls suggest the 
      point of origin was near the electrical panel. Multiple samples were collected for laboratory analysis.`,
    },
    {
      id: 'section-3',
      title: 'Witness Statements',
      enabled: true,
      content: `Three witnesses were interviewed at the scene. Security guard John Martinez reported 
      seeing smoke coming from the northeast corner at approximately 02:28 AM. Witness statements 
      are consistent with the physical evidence found during scene examination.`,
    },
    {
      id: 'section-4',
      title: 'Evidence Collection',
      enabled: false,
      content: `A total of 12 evidence samples were collected from the scene, including electrical 
      components, flooring materials, and debris samples. All samples have been submitted to the 
      State Fire Lab for analysis. Chain of custody documentation is attached.`,
    },
    {
      id: 'section-5',
      title: 'Cause & Origin Determination',
      enabled: true,
      content: `Based on physical evidence, witness statements, and laboratory analysis, the fire 
      originated from an electrical fault in the main distribution panel. The cause has been 
      classified as accidental. No evidence of accelerants or intentional ignition was found.`,
    },
    {
      id: 'section-6',
      title: 'Conclusions & Recommendations',
      enabled: true,
      content: `The investigation concludes that the fire was caused by an electrical fault resulting 
      from deferred maintenance on aging electrical infrastructure. It is recommended that all 
      commercial properties in the district undergo electrical safety inspections within 90 days.`,
    },
  ],
  photos: [
    {
      id: 'photo-1',
      url: 'https://picsum.photos/seed/fire1/800/600',
      caption: 'Overview of fire damage - Northeast corner',
      metadata: {
        date: '2026-03-15 06:15 AM',
        location: 'Northeast Corner, Ground Floor',
        photographer: 'Det. Sarah Johnson',
      },
    },
    {
      id: 'photo-2',
      url: 'https://picsum.photos/seed/fire2/800/600',
      caption: 'Electrical panel - Point of origin',
      metadata: {
        date: '2026-03-15 06:32 AM',
        location: 'Main Electrical Room',
        photographer: 'Det. Sarah Johnson',
      },
    },
    {
      id: 'photo-3',
      url: 'https://picsum.photos/seed/fire3/800/600',
      caption: 'Burn pattern on floor - V-pattern visible',
      metadata: {
        date: '2026-03-15 07:05 AM',
        location: 'Northeast Corner, Ground Floor',
        photographer: 'Det. Michael Chen',
      },
    },
    {
      id: 'photo-4',
      url: 'https://picsum.photos/seed/fire4/800/600',
      caption: 'Exterior damage - East wall',
      metadata: {
        date: '2026-03-15 07:45 AM',
        location: 'Exterior East Wall',
        photographer: 'Det. Michael Chen',
      },
    },
    {
      id: 'photo-5',
      url: 'https://picsum.photos/seed/fire5/800/600',
      caption: 'Evidence sample collection - Area 3',
      metadata: {
        date: '2026-03-15 08:20 AM',
        location: 'Evidence Collection Zone 3',
        photographer: 'Det. Sarah Johnson',
      },
    },
    {
      id: 'photo-6',
      url: 'https://picsum.photos/seed/fire6/800/600',
      caption: 'Roof damage - Structural assessment',
      metadata: {
        date: '2026-03-15 09:10 AM',
        location: 'Roof Level',
        photographer: 'Det. Michael Chen',
      },
    },
  ],
}