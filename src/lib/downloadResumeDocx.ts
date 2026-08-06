function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 70) return false;
  return trimmed.endsWith(':') || (/[A-Z]/.test(trimmed) && trimmed === trimmed.toUpperCase());
}

export async function downloadResumeDocx(resumeText: string, filename = 'vacancy-tailored-resume.docx') {
  const { AlignmentType, Document, Packer, Paragraph, TextRun } = await import('docx');
  const lines = resumeText.replace(/\r\n/g, '\n').split('\n');

  const children = lines.map((rawLine) => {
    const line = rawLine.trim();
    const bullet = /^[-•*]\s+/.test(line);
    const heading = isHeading(line);
    const text = bullet ? line.replace(/^[-•*]\s+/, '') : line;

    return new Paragraph({
      alignment: heading ? AlignmentType.LEFT : undefined,
      bullet: bullet ? { level: 0 } : undefined,
      spacing: {
        before: heading ? 100 : 0,
        after: line ? (heading ? 35 : 22) : 55,
        line: 218,
      },
      keepNext: heading,
      children: line
        ? [new TextRun({ text, bold: heading, size: heading ? 21 : 19, font: 'Arial' })]
        : [],
    });
  });

  const doc = new Document({
    creator: 'ResumeGov',
    description: 'Vacancy-targeted, fact-checked federal resume',
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 19 },
          paragraph: { spacing: { line: 218, after: 22 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
