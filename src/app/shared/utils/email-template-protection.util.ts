/**
 * Utility class để bảo vệ các đoạn code trong email template
 * Không cho phép chỉnh sửa các đoạn code bắt đầu bằng {} hoặc thẻ HTML
 */
export class EmailTemplateProtectionUtil {
  
  /**
   * Kiểm tra xem text có chứa các đoạn code được bảo vệ không
   * @param text - Text cần kiểm tra
   * @returns true nếu có đoạn code được bảo vệ
   */
  static hasProtectedCode(text: string): boolean {
    if (!text) return false;
    
    // Kiểm tra các đoạn code có format cụ thể (class.property hoặc tương tự)
    // Ví dụ: {FsConfigInvestorDTO.fsConfigInvestorId}, {UserDTO.name}, {LoanDTO.amount}
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    const hasSpecificCodePattern = specificCodePattern.test(text);
    
    // Kiểm tra thẻ HTML
    const htmlPattern = /<[^>]*>/g;
    const hasHtmlPattern = htmlPattern.test(text);
    
    return hasSpecificCodePattern || hasHtmlPattern;
  }

  /**
   * Tách text thành các phần có thể chỉnh sửa và không thể chỉnh sửa
   * @param text - Text cần tách
   * @returns Object chứa các phần text
   */
  static splitTextIntoEditableParts(text: string): {
    editableParts: string[];
    protectedParts: string[];
    fullText: string;
  } {
    if (!text) {
      return {
        editableParts: [],
        protectedParts: [],
        fullText: ''
      };
    }

    const editableParts: string[] = [];
    const protectedParts: string[] = [];
    
    // Regex để tìm các đoạn code được bảo vệ (chỉ các code có format cụ thể)
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    const htmlPattern = /<[^>]*>/g;
    const protectedPattern = new RegExp(`(${specificCodePattern.source}|${htmlPattern.source})`, 'g');
    
    let lastIndex = 0;
    let match;
    
    while ((match = protectedPattern.exec(text)) !== null) {
      // Thêm phần text trước đoạn code được bảo vệ (nếu có)
      if (match.index > lastIndex) {
        const editablePart = text.substring(lastIndex, match.index);
        if (editablePart.trim()) {
          editableParts.push(editablePart);
        }
      }
      
      // Thêm đoạn code được bảo vệ
      protectedParts.push(match[0]);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Thêm phần text cuối cùng (nếu có)
    if (lastIndex < text.length) {
      const lastPart = text.substring(lastIndex);
      if (lastPart.trim()) {
        editableParts.push(lastPart);
      }
    }
    
    return {
      editableParts,
      protectedParts,
      fullText: text
    };
  }

  /**
   * Tạo text hiển thị với các phần được bảo vệ được đánh dấu
   * @param text - Text gốc
   * @returns Text với các phần được bảo vệ được đánh dấu
   */
  static createDisplayTextWithProtection(text: string): string {
    if (!text) return '';
    
    // Thay thế các đoạn code được bảo vệ bằng version được đánh dấu
    let displayText = text;
    
    // Đánh dấu các đoạn code có format cụ thể (class.property)
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    displayText = displayText.replace(specificCodePattern, (match) => {
      return `<span class="protected-code" style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-family: monospace;">${match}</span>`;
    });
    
    // Đánh dấu các thẻ HTML
    displayText = displayText.replace(/<[^>]*>/g, (match) => {
      return `<span class="protected-html" style="background-color: #e3f2fd; padding: 2px 4px; border-radius: 3px; font-family: monospace;">${match}</span>`;
    });
    
    return displayText;
  }

  /**
   * Kiểm tra xem có thể chỉnh sửa text hay không
   * @param text - Text cần kiểm tra
   * @returns true nếu có thể chỉnh sửa
   */
  static isEditable(text: string): boolean {
    if (!text) return true;
    
    // Nếu toàn bộ text là đoạn code được bảo vệ thì không thể chỉnh sửa
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    const htmlPattern = /<[^>]*>/g;
    const protectedPattern = new RegExp(`^(${specificCodePattern.source}|${htmlPattern.source})+$`);
    return !protectedPattern.test(text.trim());
  }

  /**
   * Lấy danh sách các đoạn code được bảo vệ trong text
   * @param text - Text cần kiểm tra
   * @returns Array các đoạn code được bảo vệ
   */
  static getProtectedCodes(text: string): string[] {
    if (!text) return [];
    
    const protectedCodes: string[] = [];
    
    // Tìm các đoạn code có format cụ thể (class.property)
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    let match;
    while ((match = specificCodePattern.exec(text)) !== null) {
      protectedCodes.push(match[0]);
    }
    
    // Tìm các thẻ HTML
    const htmlPattern = /<[^>]*>/g;
    while ((match = htmlPattern.exec(text)) !== null) {
      protectedCodes.push(match[0]);
    }
    
    return protectedCodes;
  }

  /**
   * Tạo text preview với các phần được bảo vệ được highlight
   * @param text - Text gốc
   * @returns HTML string để hiển thị
   */
  static createPreviewText(text: string): string {
    if (!text) return '';
    
    let previewText = text;
    
    // Highlight các đoạn code có format cụ thể (class.property)
    const specificCodePattern = /\{[A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*\}/g;
    previewText = previewText.replace(specificCodePattern, (match) => {
      return `<mark style="background-color: #ffeb3b; padding: 1px 3px; border-radius: 2px;">${match}</mark>`;
    });
    
    // Highlight các thẻ HTML
    previewText = previewText.replace(/<[^>]*>/g, (match) => {
      return `<mark style="background-color: #e3f2fd; padding: 1px 3px; border-radius: 2px;">${match}</mark>`;
    });
    
    return previewText;
  }
}
