using AutoMapper;
using NewProject.Server.Models;
using NewProject.Server.DTO;

namespace NewProject.Server.Mapping
{
    public class UserProfileMapping : Profile
    {
        public UserProfileMapping()
        {
            // 🟢 Map User → UserProfileUpdateDTO (for returning user data)
            CreateMap<User, UserProfileUpdateDTO>()
                .ForMember(dest => dest.MobileNumber, opt => opt.MapFrom(src => src.ContactNumber));

            // 🟠 Map UserProfileUpdateRequest → User (for updating user data)
            CreateMap<UserProfileUpdateRequest, User>()
                .ForMember(dest => dest.Avatar, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // handle hashing manually
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())    // don’t update system fields
                .ForMember(dest => dest.Role, opt => opt.Ignore());        // don’t let users change their role
        }
    }
}
