# Mock Data Generator

[Vietnamese Version Below](#tiếng-việt)

A powerful tool designed to help developers and testers quickly generate high-quality mock data for their applications.

## Overview
Mock Data Generator is a full-stack application that allows users to define custom data structures (templates) and generate thousands of rows of realistic mock data. It supports various data types like Names, Emails, Phone Numbers, Addresses, and more.

## Key Features
- **Premium UI**: Modern, vibrant light theme with glassmorphism effects and responsive layout.
- **Custom Data Types**: Support for Custom Regex and Custom Lists (pick from your own values).
- **Extended Data Types**: 30+ data types including Avatar, Product, Credit Card, IPv4, etc.
- **Template Management**: Create, save, and reuse data generation templates.
- **Multi-language Support**: UI and data generation available in English, Vietnamese, and Traditional Chinese.
- **Export Data**: Download generated data in JSON, CSV, or SQL format.

## Technology Stack
- **Frontend**: React, TypeScript, Vite, i18next, Modern CSS (Glassmorphism).
- **Backend**: ASP.NET Core 8.0, Dapper, Bogus.
- **Database**: SQL Server.

---

## Custom Lists Usage
To use the **Custom List** feature:
1. Select "Custom List" from the Data Type dropdown.
2. In the new input field that appears, enter your values separated by commas (e.g., `Small, Medium, Large`).
3. The generator will randomly pick one of these values for each row.

---

<a name="tiếng-việt"></a>
# Trình Tạo Dữ Liệu Giả (Mock Data Generator)

Một công cụ mạnh mẽ giúp các nhà phát triển và kiểm thử viên nhanh chóng tạo ra dữ liệu giả chất lượng cao cho các ứng dụng của họ.

## Giao diện & Tính năng mới
- **Giao diện Cao cấp**: Thiết kế Glassmorphism hiện đại, hiệu ứng mượt mà.
- **Kiểu dữ liệu Tùy chỉnh**: Hỗ trợ Custom Regex và Danh sách riêng (Custom List).
- **Mở rộng Kiểu dữ liệu**: Hơn 30 loại dữ liệu (Avatar, Sản phẩm, Thẻ tín dụng, IPv4...).
- **Quản Lý Template**: Tạo, lưu và tái sử dụng các mẫu tạo dữ liệu.
- **Hỗ Trợ Đa Ngôn Ngữ**: Tiếng Anh, tiếng Việt và tiếng Trung (Phồn thể).
- **Xuất Dữ Liệu**: Định dạng JSON, CSV và SQL.

## Công Nghệ Sử Dụng
- **Frontend**: React, TypeScript, Vite, i18next, Modern CSS.
- **Backend**: ASP.NET Core 8.0, Dapper, Bogus.
- **Cơ sở dữ liệu**: SQL Server.

---

## Cách dùng Danh sách Tùy chỉnh (Custom List)
Để sử dụng tính năng **Custom List**:
1. Chọn "Custom List" trong danh sách DataType.
2. Nhập các giá trị của bạn cách nhau bởi dấu phẩy (VD: `Vàng, Bạc, Đồng`).
3. Trình tạo sẽ chọn ngẫu nhiên một trong các giá trị này cho mỗi dòng dữ liệu.

---

## Cài Đặt và Chạy Dự Án

### 1. Thiết Lập Cơ Sở Dữ Liệu
1. Mở SQL Server Management Studio (SSMS) hoặc bất kỳ trình quản lý SQL nào.
2. Chạy file script tại đường dẫn `Database/schema.sql`.
3. Đảm bảo chuỗi kết nối (connection string) trong `Backend/MockDataGenerator.API/appsettings.json` khớp với máy chủ SQL Server của bạn.

### 2. Thiết Lập Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd Backend/MockDataGenerator.API
   ```
2. Khôi phục các gói phụ thuộc và chạy dự án:
   ```bash
   dotnet run
   ```
3. API sẽ chạy tại `http://localhost:5293`. Bạn có thể xem tài liệu Swagger tại `/swagger`.

### 3. Thiết Lập Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd Frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
4. Truy cập ứng dụng tại `http://localhost:5173`.
