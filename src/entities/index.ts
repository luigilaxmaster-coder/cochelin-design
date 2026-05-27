/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: contactinquiries
 * Interface for ContactInquiries
 */
export interface ContactInquiries {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderName?: string;
  /** @wixFieldType text */
  emailAddress?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  inquiryMessage?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: projectportfolio
 * Interface for ProjectPortfolio
 */
export interface ProjectPortfolio {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  detailedDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  mainImage?: string;
  /** @wixFieldType date */
  completionDate?: Date | string;
  /** @wixFieldType text */
  clientName?: string;
}


/**
 * Collection ID: services
 * Interface for Services
 */
export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  serviceName?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  detailedExplanation?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  serviceImage?: string;
  /** @wixFieldType text */
  serviceCategory?: string;
  /** @wixFieldType url */
  callToActionUrl?: string;
}
