# GYM PT PRO — bản khởi đầu offline

Ứng dụng React Native / Expo bằng tiếng Việt, giao diện tối đen-vàng. Mục tiêu là chạy như ứng dụng iOS/Android và lưu dữ liệu cục bộ để dùng offline.

## Có trong bản này
- Dashboard, hồ sơ học viên
- Kho bài tập mẫu theo nhóm cơ, có tìm kiếm và hướng dẫn kỹ thuật
- Tạo lịch tập 30 ngày theo mục tiêu, trình độ, số buổi và thiết bị
- Máy tính năng lượng tham khảo và thực đơn khung
- Theo dõi khoản thu PT
- Lưu dữ liệu cục bộ bằng AsyncStorage

## Giới hạn quan trọng
Đây là **MVP khởi đầu**, chưa phải bản phát hành thương mại hoàn thiện. Kho bài tập hiện là dữ liệu mẫu, giáo án sinh tự động cần PT kiểm tra và chỉnh sửa, thực đơn chưa có cơ sở dữ liệu dinh dưỡng từng món/khẩu phần, và chưa có xuất/nhập bản sao lưu, đăng nhập, mã hóa dữ liệu hay đồng bộ. Không nhập thông tin sức khỏe nhạy cảm của khách hàng thật trước khi bổ sung các biện pháp bảo mật và sao lưu phù hợp.

## Chạy dự án
1. Cài Node.js trên máy tính (nếu có) và chạy `npm install`.
2. Chạy `npx expo start`.
3. Để cài app iOS lên iPhone, dùng EAS Build trên cloud và làm theo yêu cầu ký ứng dụng của Apple. Chỉ có GitHub không tự cài được app lên iPhone.

## Build trên cloud
1. Đẩy toàn bộ thư mục này lên repository GitHub.
2. Tạo tài khoản Expo và cài/thiết lập EAS CLI trong môi trường có terminal, hoặc dùng workflow build cloud đã cấu hình.
3. Dùng `eas build --platform ios --profile preview` hoặc `--profile production`.
4. Phân phối nội bộ/TestFlight cần tuân theo yêu cầu tài khoản và ký của Apple. Kiểm tra giá và chính sách hiện hành trước khi đăng ký.

## Cấu trúc
- `App.js`: giao diện và logic MVP
- `package.json`: dependencies
- `app.json`: cấu hình Expo
- `eas.json`: profile build
