// const fields = [
//     { label: 'Tên phim chính', name: 'NameEN', type: 'text', placeholder: 'Nhập tên tiếng Anh' },
//     { label: 'Tên phim phụ', name: 'NameVN', type: 'text', placeholder: 'Nhập tên tiếng Việt' },
//     { label: 'Đạo diễn', name: 'Directors', type: 'textarea', placeholder: 'Nhập danh sách đạo diễn, phân cách bằng dấu phẩy' },
//     { label: 'Diễn viên', name: 'Cast', type: 'textarea', placeholder: 'Nhập danh sách diễn viên, phân cách bằng dấu phẩy' },
//     { label: 'Chi tiết phim', name: 'Detail', type: 'textarea', placeholder: 'Nhập chi tiết nội dung phim' },
//     { label: 'Trailer', name: 'Trailer', type: 'file', accept: 'video/*' },
//     { label: 'Giới hạn độ tuổi', name: 'AgeLimit', type: 'select', options: ['G', 'PG', 'PG-13', 'R', 'NC-17'] },
//     { label: 'Ảnh poster', name: 'Photo', type: 'file', accept: 'image/*' },
//     { label: 'Ảnh nền', name: 'Background', type: 'file', accept: 'image/*' },
//     { label: 'Tình trạng phim', name: 'Status', type: 'select', options: ['Đang chiếu', 'Sắp chiếu', 'Ngừng chiếu'] },
//     { label: 'Xếp hạng', name: 'Rating', type: 'number', min: 0, max: 10, step: 0.1 }
//   ]

//   const renderField = (field) => {
//     if (field.type === 'textarea') {
//       return <Textarea placeholder={field.placeholder} {...form.register(field.name)} />
//     }

//     if (field.type === 'select') {
//       return (
//         <select {...form.register(field.name)}>
//           {field.options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       )
//     }

//     return <Input type={field.type} accept={field.accept} placeholder={field.placeholder} {...form.register(field.name)} />
//   }
