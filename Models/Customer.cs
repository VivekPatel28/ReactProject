﻿using System.ComponentModel.DataAnnotations;

namespace ReactProject.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Sales = new HashSet<Sale>();
        }

        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Address { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
