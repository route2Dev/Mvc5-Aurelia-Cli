using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Mvc5_Aurelia_Cli.Entities;
using Mvc5_Aurelia_Cli.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mvc5_Aurelia_Cli.Services
{
    public class AuthService : IDisposable
    {
        private readonly ApplicationDbContext _context;

        private readonly ApplicationUserManager _userManager;

        public AuthService()
        {
            _context = new ApplicationDbContext();
            _userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(_context));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            var user = new ApplicationUser
            {
                UserName = userModel.UserName
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }

        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            var user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public Client FindClient(string clientId)
        {
            var client = _context.Clients.Find(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

            var existingToken = _context.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            _context.RefreshTokens.Add(token);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _context.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshToken != null)
            {
                _context.RefreshTokens.Remove(refreshToken);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Remove(refreshToken);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _context.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
            return _context.RefreshTokens.ToList();
        }

        public void Dispose()
        {
            _userManager.Dispose();
            _context.Dispose();
        }
    }
}
