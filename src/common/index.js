export function removeVietnameseAccents(str) {
  return str
    .normalize("NFD") // Tách dấu và ký tự tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Thay thế ký tự 'đ' thành 'd'
    .replace(/Đ/g, "D") // Thay thế ký tự 'Đ' thành 'D'
    .trim(); // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
}
