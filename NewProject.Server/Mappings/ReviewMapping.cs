
using AutoMapper;
using NewProject.Server.DTO;
using NewProject.Server.Models;

namespace NewProject.Server.Mappings
{
    public class ReviewMapping : Profile
    {

        public ReviewMapping()
        {
            CreateMap<CreateReviewDTO, CustomerReview>();

            CreateMap<CustomerReview , ReviewResponseDto>()
                .ForMember(d => d.UserId, m => m.MapFrom(s => s.User.Id))
                .ForMember(d => d.UserFullName, m => m.MapFrom(s => s.User.FullName))
                .ForMember(d => d.UserAvatar, m => m.MapFrom(s => s.User.Avatar));

            CreateMap<ReviewUpdateDTO, CustomerReview>();
        }

    }
}
