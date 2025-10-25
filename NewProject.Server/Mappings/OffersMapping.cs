using AutoMapper;
using NewProject.Server.Models;
using NewProject.Server.DTO;

namespace NewProject.Server.NewFolder
{
    public class OffersMapping : Profile
    {
        public OffersMapping()
        {
            CreateMap<Offer, OffersDTO>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

            CreateMap<OffersDTO, Offer>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<OfferType>(src.Type)));
        }
    }
}
