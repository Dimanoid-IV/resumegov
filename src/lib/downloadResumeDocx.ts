function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 70) return false;
  return trimmed.endsWith(':') || (/[A-Z]/.test(trimmed) && trimmed === trimmed.toUpperCase());
}

export async function createResumeDocxBlob(resumeText: string): Promise<Blob> {
  const { AlignmentType, Document, Packer, Paragraph, TextRun } = await import('docx');
  const lines = resumeText.replace(/\r\n/g, '\n').split('\n');

  const children = lines.map((rawLine) => {
    const markdownHeading = /^#{1,3}\s+/.test(rawLine.trim());
    const line = rawLine.trim().replace(/^#{1,3}\s+/, '').replace(/\*\*([^*]+)\*\*/g, '$1');
    const bullet = /^[-•*]\s+/.test(line);
    const heading = markdownHeading || isHeading(line);
    const text = bullet ? line.replace(/^[-•*]\s+/, '') : line;

    return new Paragraph({
      alignment: heading ? AlignmentType.LEFT : undefined,
      bullet: bullet ? { level: 0 } : undefined,
      spacing: {
        before: heading ? 100 : 0,
        after: line ? (heading ? 35 : 22) : 55,
        line: 240,
      },
      keepNext: heading,
      children: line
        ? [new TextRun({ text, bold: heading, size: heading ? 28 : 21, font: 'Arial', color: '000000' })]
        : [],
    });
  });

  const doc = new Document({
    creator: 'ResumeGov',
    description: 'Vacancy-targeted, fact-checked federal resume',
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 21, color: '000000' },
          paragraph: { spacing: { line: 240, after: 22 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}

export async function downloadResumeDocx(resumeText: string, filename = 'vacancy-tailored-resume.docx') {
  const blob = await createResumeDocxBlob(resumeText);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
