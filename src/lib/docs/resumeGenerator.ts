/**
 * DOCX Generator for Federal Resumes
 * Generates downloadable .docx files
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export interface ResumeDocumentOptions {
  content: string;
  fileName?: string;
  includeHeader?: boolean;
  headerText?: string;
}

/**
 * Parse resume text into DOCX paragraphs
 */
function parseResumeToParagraphs(text: string): Paragraph[] {
  const lines = text.split('\n');
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      paragraphs.push(new Paragraph({}));
      continue;
    }

    // Check for section headers
    if (trimmed.match(/^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS|PROFESSIONAL|CONTACT)/i)) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.toUpperCase(),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
      continue;
    }

    // Check for job titles (lines with dates or positions)
    if (trimmed.match(/^[A-Z].*\d{4}/) || trimmed.match(/^(Senior|Junior|Lead|Principal)/i)) {
      paragraphs.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
      continue;
    }

    // Bullet points
    if (trimmed.match(/^[-*•]/)) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^[-*•]\s*/, ''),
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
      continue;
    }

    // Regular text
    paragraphs.push(
      new Paragraph({
        text: trimmed,
        spacing: { after: 100 },
      })
    );
  }

  return paragraphs;
}

/**
 * Generate DOCX document from resume content
 */
export async function generateResumeDocx(options: ResumeDocumentOptions): Promise<Blob> {
  const { 
    content, 
    fileName = 'federal-resume.docx',
    includeHeader = true,
    headerText = 'FEDERAL RESUME'
  } = options;

  const children: Paragraph[] = [];

  // Add header
  if (includeHeader && headerText) {
    children.push(
      new Paragraph({
        text: headerText,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
    children.push(new Paragraph({})); // Empty line
  }

  // Add resume content
  const contentParagraphs = parseResumeToParagraphs(content);
  children.push(...contentParagraphs);

  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1000, // 1 inch
            right: 1000,
            bottom: 1000,
            left: 1000,
          },
        },
      },
      children,
    }],
  });

  // Generate blob
  const blob = await Packer.toBlob(doc);
  return blob;
}

/**
 * Download resume as DOCX file
 */
export function downloadResumeDocx(options: ResumeDocumentOptions): void {
  generateResumeDocx(options).then(blob => {
    saveAs(blob, options.fileName || 'federal-resume.docx');
  });
}

/**
 * Generate resume as base64 for API response
 */
export async function generateResumeBase64(options: ResumeDocumentOptions): Promise<string> {
  const blob = await generateResumeDocx(options);
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}
