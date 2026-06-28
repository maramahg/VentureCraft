export const VISA_DOCUMENT_UPLOAD_SEGMENT = '/visa_documents/';
export const MAX_VISA_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;
export const VISA_DOCUMENT_CONTENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png'
];

export const gccCountries = ['Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates'];
export const gccResidencyOptions = ['Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'UAE'];
export const sixMonthsFromArrival = '2027-04-01';
export const travelVisaSchemaVersion = 1;
export const maxTravelAttendees = 10;

export type TravelAttendeeDocuments = {
    nationalIdFrontName?: string | null;
    nationalIdFrontUrl?: string | null;
    nationalIdBackName?: string | null;
    nationalIdBackUrl?: string | null;
    passportBioPageName?: string | null;
    passportBioPageUrl?: string | null;
    personalPhotoName?: string | null;
    personalPhotoUrl?: string | null;
    gccResidencyFrontName?: string | null;
    gccResidencyFrontUrl?: string | null;
    gccResidencyBackName?: string | null;
    gccResidencyBackUrl?: string | null;
};

export type TravelAttendee = {
    fullName: string;
    dateOfBirth: string;
    nationalityPassport: string;
    currentResidence: string;
    occupation: string;
    sponsorshipStatus: string;
    isGccCitizen: string;
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    passportBlankPages: string;
    email: string;
    departureCityCountry: string;
    intendedAirline: string;
    hasSaudiVisa: string;
    saudiVisaType: string;
    saudiVisaIssueDate: string;
    saudiVisaExpiryDate: string;
    saudiVisaEntryType: string;
    saudiVisaUsedBefore: string;
    hasUsUkSchengenVisa: string;
    usUkSchengenType: string;
    usUkSchengenExpiryDate: string;
    usUkSchengenUsedBefore: string;
    hasGccResidency: string;
    gccResidencyCountry: string;
    gccResidencyExpiryDate: string;
    documents?: TravelAttendeeDocuments;
};

export type VisaDocumentFiles = {
    nationalIdFront: File | null;
    nationalIdBack: File | null;
    passportBioPage: File | null;
    personalPhoto: File | null;
    gccResidencyFront: File | null;
    gccResidencyBack: File | null;
};

export type SavedTravelAttendee = {
    attendeeNumber: number;
    fullName: string;
    dateOfBirth: string;
    nationalityPassport: string;
    currentResidence: string;
    occupation: string;
    sponsorshipStatus: string;
    isGccCitizen: boolean;
    email: string;
    flightDetails: {
        departureCityCountry: string | null;
        intendedAirline: string | null;
    };
    documents: TravelAttendeeDocuments;
    passportDetails?: {
        passportNumber: string;
        issueDate: string;
        expiryDate: string;
        blankPages: number;
    };
    warnings?: {
        passportExpiryUnderSixMonthsFromArrival: boolean;
        blankPassportPagesUnderTwo: boolean;
    };
    existingSaudiVisa?: {
        hasVisa: boolean;
        visaType?: string | null;
        issueDate?: string | null;
        expiryDate?: string | null;
        entryType?: string | null;
        usedToEnterKsaBefore?: string | null;
    };
    usUkSchengenVisaOrResidence?: {
        hasVisaOrResidence: boolean;
        type?: string | null;
        expiryDate?: string | null;
        usedToTravelToIssuingCountry?: string | null;
    };
    gccResidency?: {
        hasResidency: boolean;
        country?: string | null;
        expiryDate?: string | null;
    };
};

export type TravelVisaInfo = {
    schemaVersion?: number;
    attendingCount: number;
    sponsorshipReviewRequired?: boolean;
    attendees: SavedTravelAttendee[];
};

type TeamMemberSeed = {
    name: string;
    nationality: string;
};

const asRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' ? value as Record<string, unknown> : {};

export const createTravelAttendee = (fullName = ''): TravelAttendee => ({
    fullName,
    dateOfBirth: '',
    nationalityPassport: 'Saudi Arabia',
    currentResidence: 'Saudi Arabia',
    occupation: '',
    sponsorshipStatus: 'Sponsored',
    isGccCitizen: 'Yes',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportBlankPages: '',
    email: '',
    departureCityCountry: '',
    intendedAirline: '',
    hasSaudiVisa: 'No',
    saudiVisaType: '',
    saudiVisaIssueDate: '',
    saudiVisaExpiryDate: '',
    saudiVisaEntryType: '',
    saudiVisaUsedBefore: '',
    hasUsUkSchengenVisa: 'No',
    usUkSchengenType: '',
    usUkSchengenExpiryDate: '',
    usUkSchengenUsedBefore: '',
    hasGccResidency: 'No',
    gccResidencyCountry: '',
    gccResidencyExpiryDate: '',
    documents: {}
});

export const createVisaDocumentFiles = (): VisaDocumentFiles => ({
    nationalIdFront: null,
    nationalIdBack: null,
    passportBioPage: null,
    personalPhoto: null,
    gccResidencyFront: null,
    gccResidencyBack: null
});

export const normalizeTravelVisaInfo = (
    travelVisaInfo: unknown,
    teamMembers: TeamMemberSeed[]
): { attendingCount: number; attendees: TravelAttendee[] } => {
    const source = asRecord(travelVisaInfo);
    const existingAttendees = Array.isArray(source.attendees) ? source.attendees : [];
    const attendingCount = Math.min(
        Math.max(Number(source.attendingCount) || existingAttendees.length || 1, 1),
        maxTravelAttendees
    );

    const hydrateAttendee = (savedValue: unknown, fallbackName: string): TravelAttendee => {
        if (!savedValue) return createTravelAttendee(fallbackName);

        const saved = asRecord(savedValue);
        const base = createTravelAttendee(fallbackName);
        const isCleanShape = typeof saved.isGccCitizen === 'boolean' || Boolean(saved.passportDetails || saved.existingSaudiVisa);

        if (!isCleanShape) {
            return {
                ...base,
                ...saved,
                documents: asRecord(saved.documents) as TravelAttendeeDocuments
            } as TravelAttendee;
        }

        const passportDetails = asRecord(saved.passportDetails);
        const flightDetails = asRecord(saved.flightDetails);
        const existingSaudiVisa = asRecord(saved.existingSaudiVisa);
        const usUkSchengenVisaOrResidence = asRecord(saved.usUkSchengenVisaOrResidence);
        const gccResidency = asRecord(saved.gccResidency);

        return {
            ...base,
            fullName: String(saved.fullName || fallbackName),
            dateOfBirth: String(saved.dateOfBirth || ''),
            nationalityPassport: String(saved.nationalityPassport || base.nationalityPassport),
            currentResidence: String(saved.currentResidence || base.currentResidence),
            occupation: String(saved.occupation || ''),
            sponsorshipStatus: String(saved.sponsorshipStatus || base.sponsorshipStatus),
            isGccCitizen: saved.isGccCitizen ? 'Yes' : 'No',
            passportNumber: String(passportDetails.passportNumber || ''),
            passportIssueDate: String(passportDetails.issueDate || ''),
            passportExpiryDate: String(passportDetails.expiryDate || ''),
            passportBlankPages: passportDetails.blankPages?.toString?.() || '',
            email: String(saved.email || ''),
            departureCityCountry: String(flightDetails.departureCityCountry || ''),
            intendedAirline: String(flightDetails.intendedAirline || ''),
            hasSaudiVisa: existingSaudiVisa.hasVisa ? 'Yes' : 'No',
            saudiVisaType: String(existingSaudiVisa.visaType || ''),
            saudiVisaIssueDate: String(existingSaudiVisa.issueDate || ''),
            saudiVisaExpiryDate: String(existingSaudiVisa.expiryDate || ''),
            saudiVisaEntryType: String(existingSaudiVisa.entryType || ''),
            saudiVisaUsedBefore: String(existingSaudiVisa.usedToEnterKsaBefore || ''),
            hasUsUkSchengenVisa: usUkSchengenVisaOrResidence.hasVisaOrResidence ? 'Yes' : 'No',
            usUkSchengenType: String(usUkSchengenVisaOrResidence.type || ''),
            usUkSchengenExpiryDate: String(usUkSchengenVisaOrResidence.expiryDate || ''),
            usUkSchengenUsedBefore: String(usUkSchengenVisaOrResidence.usedToTravelToIssuingCountry || ''),
            hasGccResidency: gccResidency.hasResidency ? 'Yes' : 'No',
            gccResidencyCountry: String(gccResidency.country || ''),
            gccResidencyExpiryDate: String(gccResidency.expiryDate || ''),
            documents: asRecord(saved.documents) as TravelAttendeeDocuments
        };
    };

    const attendees = Array.from({ length: attendingCount }, (_, index) =>
        hydrateAttendee(existingAttendees[index], teamMembers[index]?.name || '')
    );

    return { attendingCount, attendees };
};

export const cleanTravelAttendeeForSave = (attendee: TravelAttendee, index: number): SavedTravelAttendee => {
    const isGccCitizen = attendee.isGccCitizen === 'Yes';
    const hasSaudiVisa = attendee.hasSaudiVisa === 'Yes';
    const hasUsUkSchengenVisa = attendee.hasUsUkSchengenVisa === 'Yes';
    const hasGccResidency = attendee.hasGccResidency === 'Yes';
    const documents = attendee.documents || {};

    const common = {
        attendeeNumber: index + 1,
        fullName: attendee.fullName.trim(),
        dateOfBirth: attendee.dateOfBirth,
        nationalityPassport: attendee.nationalityPassport,
        currentResidence: attendee.currentResidence,
        occupation: attendee.occupation.trim(),
        sponsorshipStatus: attendee.sponsorshipStatus,
        isGccCitizen,
        email: attendee.email.trim().toLowerCase(),
        flightDetails: {
            departureCityCountry: attendee.departureCityCountry.trim() || null,
            intendedAirline: attendee.intendedAirline.trim() || null
        },
        documents: {
            personalPhotoName: documents.personalPhotoName || null,
            personalPhotoUrl: documents.personalPhotoUrl || null
        }
    };

    if (isGccCitizen) {
        return {
            ...common,
            documents: {
                ...common.documents,
                nationalIdFrontName: documents.nationalIdFrontName || null,
                nationalIdFrontUrl: documents.nationalIdFrontUrl || null,
                nationalIdBackName: documents.nationalIdBackName || null,
                nationalIdBackUrl: documents.nationalIdBackUrl || null
            }
        };
    }

    return {
        ...common,
        passportDetails: {
            passportNumber: attendee.passportNumber.trim(),
            issueDate: attendee.passportIssueDate,
            expiryDate: attendee.passportExpiryDate,
            blankPages: Number(attendee.passportBlankPages)
        },
        warnings: {
            passportExpiryUnderSixMonthsFromArrival: Boolean(attendee.passportExpiryDate && attendee.passportExpiryDate < sixMonthsFromArrival),
            blankPassportPagesUnderTwo: Number(attendee.passportBlankPages) < 2
        },
        documents: {
            ...common.documents,
            passportBioPageName: documents.passportBioPageName || null,
            passportBioPageUrl: documents.passportBioPageUrl || null,
            ...(hasGccResidency ? {
                gccResidencyFrontName: documents.gccResidencyFrontName || null,
                gccResidencyFrontUrl: documents.gccResidencyFrontUrl || null,
                gccResidencyBackName: documents.gccResidencyBackName || null,
                gccResidencyBackUrl: documents.gccResidencyBackUrl || null
            } : {})
        },
        existingSaudiVisa: {
            hasVisa: hasSaudiVisa,
            ...(hasSaudiVisa ? {
                visaType: attendee.saudiVisaType || null,
                issueDate: attendee.saudiVisaIssueDate || null,
                expiryDate: attendee.saudiVisaExpiryDate || null,
                entryType: attendee.saudiVisaEntryType || null,
                usedToEnterKsaBefore: attendee.saudiVisaUsedBefore || null
            } : {})
        },
        usUkSchengenVisaOrResidence: {
            hasVisaOrResidence: hasUsUkSchengenVisa,
            ...(hasUsUkSchengenVisa ? {
                type: attendee.usUkSchengenType || null,
                expiryDate: attendee.usUkSchengenExpiryDate || null,
                usedToTravelToIssuingCountry: attendee.usUkSchengenUsedBefore || null
            } : {})
        },
        gccResidency: {
            hasResidency: hasGccResidency,
            ...(hasGccResidency ? {
                country: attendee.gccResidencyCountry || null,
                expiryDate: attendee.gccResidencyExpiryDate || null
            } : {})
        }
    };
};

export const countSponsoredAttendees = (travelVisaInfo?: Pick<TravelVisaInfo, 'attendees'> | null) =>
    travelVisaInfo?.attendees?.filter(attendee => attendee.sponsorshipStatus === 'Sponsored').length || 0;

export const countPassportWarningAttendees = (travelVisaInfo?: Pick<TravelVisaInfo, 'attendees'> | null) =>
    travelVisaInfo?.attendees?.filter(attendee =>
        attendee.warnings?.passportExpiryUnderSixMonthsFromArrival ||
        attendee.warnings?.blankPassportPagesUnderTwo
    ).length || 0;
